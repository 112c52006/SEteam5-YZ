using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_manage_system_backend.Dtos;
using project_manage_system_backend.Models;
using project_manage_system_backend.Shares;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace project_manage_system_backend.Services
{
    public class ProjectService : BaseService
    {
        private string defaultImagePath = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot/DefaultCover.jpg");

        public ProjectService(PMSContext dbContext) : base(dbContext) { }

        public void CreateProject(ProjectDto projectDto, string userId)
        {
            string regexPattern = "^[A-Za-z0-9]+";
            Regex regex = new Regex(regexPattern);
            if (projectDto.ProjectName == "" || !regex.IsMatch(projectDto.ProjectName))
            {
                throw new Exception("please enter project name");
            }
            var user = _dbContext.Users.Include(u => u.Projects).ThenInclude(p => p.Project).FirstOrDefault(u => u.Account.Equals(userId));

            if (user != null)
            {
                var userProject = (from up in user.Projects
                                   where up.Project.Name == projectDto.ProjectName
                                   select up.Project.Name).ToList();
                if (userProject.Count == 0)
                {
                    var newProject = new Models.UserProject
                    {
                        Project = new Models.Project { Name = projectDto.ProjectName, Owner = user },
                    };

                    user.Projects.Add(newProject);
                }
                else
                {
                    throw new Exception("duplicate project name");
                }
            }
            else
            {
                throw new Exception("user fail, can not find this user");
            }


            if (_dbContext.SaveChanges() == 0)
            {
                throw new Exception("create project fail");
            }
        }

        public void EditProjectName(ProjectDto projectDto)
        {
            string regexPattern = "^[A-Za-z0-9_-]+$";
            Regex regex = new Regex(regexPattern);
            if (projectDto.ProjectName == "" || !regex.IsMatch(projectDto.ProjectName))
            {
                throw new Exception("please enter project name");
            }
            else if (_dbContext.Projects.Where(p => p.Name == projectDto.ProjectName).ToList().Count != 0)
            {
                throw new Exception("duplicate project name");
            }

            var project = _dbContext.Projects.Find(projectDto.ProjectId);

            project.Name = projectDto.ProjectName;

            _dbContext.Update(project);

            if (_dbContext.SaveChanges() == 0)
            {
                throw new Exception("edit project name fail");
            }
        }

        //---編輯Project圖片---//
        public async Task EditProjectCoverImage(int projectId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Src"); // 設定儲存檔案的資料夾路徑

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{projectId}.jpg";

            var filePath = Path.Combine(uploadsFolder, fileName);

            if (System.IO.File.Exists(filePath))
            {
                Console.WriteLine("Delete");
                System.IO.File.Delete(filePath);
            }

            Console.WriteLine("A");
            var project = _dbContext.Projects.Find(projectId);
            //Not Found
            Console.WriteLine("B");
            if (project == null)
            {
                throw new Exception($"Project with ID {projectId} not found.");
            }
            else
            {
                project.CoverImagePath = filePath;

                if (_dbContext.SaveChanges() == 0)
                {
                    Console.WriteLine("No Change");
                }
                Console.WriteLine("New Cover");
            }

            using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await file.CopyToAsync(stream);
                stream.Close();
            }
        }
        byte[] ConvertFileToByte(IFormFile file)
        {
            if (file!= null && file.Length > 0)
            {
                // 將 IFormFile 轉換成 byte 陣列
                byte[] fileBytes;
                using (var memoryStream = new MemoryStream())
                {
                    file.CopyTo(memoryStream);
                    //file.CopyTo(memoryStream);
                    fileBytes = memoryStream.ToArray();
                }
                return fileBytes;
            }
            throw new Exception($"Convert image file to Byte[] failed.");
        }

        //---編輯ProjectIntro---//
        public void EditProjectIntro(ProjectEditInfoDto ProjectEditInfoDto)
        {
            //Find
            var project = _dbContext.Projects.Find(ProjectEditInfoDto.ProjectId);
            //Not Found
            if (project == null)
            {
                throw new Exception($"Project with ID {ProjectEditInfoDto.ProjectId} not found.");
            }
            //Found
            else
            {
                // Edit
                project.Intro = ProjectEditInfoDto.Intro;
                // Write to Database
                if (_dbContext.SaveChanges() == 0)
                {
                    throw new Exception($"Edit Project with ID {ProjectEditInfoDto.ProjectId} CoverImage fail.");
                }
            }
        }

        //---從DB取得Projects by User Account---//
        // 新增 CoverImage = up.Project.CoverImage
        // 新增 Intro = up.Project.Intro
        public List<ProjectResultDto> GetProjectByUserAccount(string account)
        {
            var user = _dbContext.Users.Include(u => u.Projects).ThenInclude(p => p.Project).ThenInclude(p => p.Owner).FirstOrDefault(u => u.Account.Equals(account));
            var query = (from up in user.Projects
                         select new ProjectResultDto { Id = up.Project.ID,
                                                       Name = up.Project.Name,
                                                       OwnerId = up.Project.Owner.Account,
                                                       OwnerName = up.Project.Owner.Name,
                                                       Intro = up.Project.Intro}).ToList();
            return query;
        }

        //---從DB取得Project by User id---//
        public ProjectResultDto GetProjectByProjectId(int projectId, string account)
        {
            List<ProjectResultDto> userProject = GetProjectByUserAccount(account);

            foreach (ProjectResultDto projectResultDto in userProject)
            {
                if (projectResultDto.Id == projectId)
                {
                    return projectResultDto;
                }
            }
            throw new Exception("error project");
        }

        public Stream GetProjectImageStream(int projectId) { 
        
            var project = _dbContext.Projects.Find(projectId);

            //Console.WriteLine(project.CoverImagePath);

            if (project != null && !string.IsNullOrEmpty(project.CoverImagePath) && System.IO.File.Exists(project.CoverImagePath))
            {
                return System.IO.File.OpenRead(project.CoverImagePath);
            }
            
            return System.IO.File.OpenRead(defaultImagePath);
        }

        public List<UserInfoDto> GetProjectMember(int projectId)
        {
            var projectById = _dbContext.Projects.Include(p => p.Users).ThenInclude(u => u.User).FirstOrDefault(p => p.ID == projectId);

            if (projectById != null)
            {
                var projectMember = projectById.Users;

                List<UserInfoDto> result = new List<UserInfoDto>();

                foreach (UserProject userProject in projectMember)
                {
                    result.Add(new UserInfoDto { id = userProject.User.Account, name = userProject.User.Name });
                }

                return result;
            }
            else
            {
                throw new Exception("project is not found");
            }

        }

        public List<ProjectResultDto> GetAllProject()
        {
            return _dbContext.Projects.Select(p => new ProjectResultDto { Id = p.ID, Name = p.Name, OwnerId = p.Owner.Account, OwnerName = p.Owner.Name, Members = p.Users.Count }).ToList();
        }

        public void DeleteProject(int projectId)
        {
            var invitations = _dbContext.Invitations.Where(i => i.InvitedProject.ID.Equals(projectId));
            _dbContext.Invitations.RemoveRange(invitations);
            var repos = _dbContext.Repositories.Where(r => r.Project.ID.Equals(projectId));
            _dbContext.Repositories.RemoveRange(repos);
            var project = _dbContext.Projects.Find(projectId);
            _dbContext.Projects.Remove(project);

            if (_dbContext.SaveChanges() == 0)
                throw new Exception("Delete project fail!");
        }

        public void DeleteProjectMember(string userId, int projectId)
        {
            var user = _dbContext.Users.Find(userId);
            var project = user.Projects.Where(p => p.ProjectId.Equals(projectId)).FirstOrDefault();
            user.Projects.Remove(project);

            if (_dbContext.SaveChanges() == 0)
                throw new Exception("Delete project member fail!");
        }

        public bool EditProjectNameByAdmin(int projectId, JsonPatchDocument<Project> newProject)
        {
            var project = _dbContext.Projects.Find(projectId);
            newProject.ApplyTo(project);
            return !(_dbContext.SaveChanges() == 0);
        }
    }
}
