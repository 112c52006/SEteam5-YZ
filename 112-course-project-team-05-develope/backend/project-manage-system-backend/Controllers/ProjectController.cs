using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project_manage_system_backend.Dtos;
using project_manage_system_backend.Models;
using project_manage_system_backend.Services;
using project_manage_system_backend.Shares;
using System.Threading.Tasks;
using System;


namespace project_manage_system_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectService _projectService;
        private readonly UserService _userService;
        private readonly PMSContext _dbContext;

        public ProjectController(PMSContext dbContext)
        {
            _dbContext = dbContext;
            _projectService = new ProjectService(_dbContext);
            _userService = new UserService(_dbContext);
        }

        [Authorize]
        [HttpPost("add")]
        public IActionResult AddProject(ProjectDto projectDto)
        {
            try
            {
                _projectService.CreateProject(projectDto, User.Identity.Name);
                return Ok(new ResponseDto
                {
                    success = true,
                    message = "Added Success"
                });
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = "Added Error" + ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost("edit")]
        public IActionResult EditProjectName(ProjectDto projectDto)
        {
            try
            {
                CheckUserIsProjectOwner(User.Identity.Name, projectDto.ProjectId);
                _projectService.EditProjectName(projectDto);
                return Ok(new ResponseDto
                {
                    success = true,
                    message = "Added Success",
                });
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = ex.Message,
                });
            }

        }


        [Authorize]
        [HttpDelete("{projectId}/{userId}")]
        public IActionResult DeleteProject(int projectId, string userId)
        {
            try
            {
                CheckUserIsProjectOwner(userId, projectId);

                _projectService.DeleteProject(projectId);

                return Ok(new ResponseDto
                {
                    success = true,
                    message = "Deleted success",
                });
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }

        [Authorize]
        [HttpDelete("member/{projectId}/{userId}")]
        public IActionResult DeleteProjectMember(int projectId, string userId)
        {
            try
            {
                CheckUserIsProjectOwner(User.Identity.Name, projectId);
                if (_userService.CheckUserExist(userId))
                {
                    var user = _userService.GetUserModel(userId);
                    if (!_userService.IsProjectOwner(user, projectId))
                    {
                        _projectService.DeleteProjectMember(userId, projectId);

                        return Ok(new ResponseDto
                        {
                            success = true,
                            message = "Deleted success",
                        });
                    }
                }
                else
                {
                    return Ok(new ResponseDto
                    {
                        success = false,
                        message = "User didn't exist",
                    });
                }
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = ex.Message,
                });
            }

            return NotFound();
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetProject()
        {
            var result = _projectService.GetProjectByUserAccount(User.Identity.Name);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("admin")]
        public IActionResult GetAllProjectByAdmin()
        {
            if (_userService.IsAdmin(User.Identity.Name))
                return Ok(_projectService.GetAllProject());
            return BadRequest("You are not a Admin");
        }

        [Authorize]
        [HttpGet("{projectId}")]
        public IActionResult GetProject(int projectId)
        {
            var result = _projectService.GetProjectByProjectId(projectId, User.Identity.Name);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("{projectId}/image")]
        public IActionResult GetProjectImage(int projectId)
        {

            var imageStream = _projectService.GetProjectImageStream(projectId);

            if (imageStream != null)
            {
                return File(imageStream, "image/jpeg");
            }

            return NotFound("Image not found.");
        }

        private bool CheckUserIsProjectOwner(string userId, int projectId)
        {
            if (_userService.CheckUserExist(userId))
            {
                var user = _userService.GetUserModel(userId);
                if (_userService.IsProjectOwner(user, projectId))
                {
                    return true;
                }
                else
                {
                    throw new Exception("You are not the project owner");
                }
            }
            else
            {
                throw new Exception("You are not the system user");
            }
        }

        [Authorize]
        [HttpGet("member/{projectId}")]
        public IActionResult GetProjectMember(int projectId)
        {
            try
            {
                return Ok(_projectService.GetProjectMember(projectId));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpPatch("{projectId}")]
        public IActionResult EditProjectNameByAdmin(int projectId, [FromBody] JsonPatchDocument<Project> newProject)
        {
            if (_userService.IsAdmin(User.Identity.Name))
            {
                if (_projectService.EditProjectNameByAdmin(projectId, newProject))
                {
                    return Ok(new ResponseDto
                    {
                        success = true,
                        message = "Edited success!"
                    });
                }
                return Ok(new ResponseDto
                {
                    success = false,
                    message = "Edited Error"
                });
            }
            return BadRequest("Who are you?");
        }

        [Authorize]
        [HttpDelete("{projectId}")]
        public IActionResult DeleteProjectByAdmin(int projectId)
        {
            if (_userService.IsAdmin(User.Identity.Name))
            {
                try
                {
                    _projectService.DeleteProject(projectId);
                    return Ok(new ResponseDto
                    {
                        success = true,
                        message = "Delete success!"
                    });
                }
                catch (Exception e)
                {
                    return Ok(new ResponseDto
                    {
                        success = false,
                        message = $"Delete Error：{e.Message}"
                    });
                }

            }
            return BadRequest("Who are you?");
        }


        //---編輯Project圖片---//, [FromForm] IFormFile file
        [HttpPost("{projectId}/editcover")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(int projectId,[FromForm(Name = "file")] IFormFile file, [FromForm(Name = "testnum")] string testnum)
        {
            try
            {
                // 使用 projectId 進行相應的操作
                Console.WriteLine($"Received projectId: {projectId}");
                Console.WriteLine($"Received testnum: {testnum}");//file != null && file.Length > 0
                if (file != null)
                {
                    // Check Project Owner
                    CheckUserIsProjectOwner(User.Identity.Name, projectId);
                    _projectService.EditProjectCoverImage(projectId, file);

                    return Ok(
                        new ResponseDto
                        {
                            success = true,
                            message = "Edited Cover Success",
                        });
                }
                else
                {
                    Console.WriteLine("File is null.");
                    return BadRequest(new { message = "未收到或未選擇文件" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = $"發生錯誤: {ex.Message}",
                });
            }
        }

        // 修改資訊欄位
        [Authorize]
        [HttpPost("editintro")]
        public IActionResult EditProjectIntro(ProjectEditInfoDto projecEditInfoDto)
        {
            try
            {
                CheckUserIsProjectOwner(User.Identity.Name, projecEditInfoDto.ProjectId);
                _projectService.EditProjectIntro(projecEditInfoDto);
                return Ok(new ResponseDto
                {
                    success = true,
                    message = "Edited Success",
                });
            }
            catch (Exception ex)
            {
                return Ok(new ResponseDto
                {
                    success = false,
                    message = ex.Message,
                });
            }
        }
    }
}