import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const getProjects: any = () => {
  return axios
    .get(`${host}/project/`, {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    })
    .then(function(response) {
      return response;
    })
    .catch(err => {
      return false;
    });
};

export const getProject = (projectId: number | null) => {
  return axios
    .get(`${host}/project/${projectId}`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${store.auth.getToken}`
      }
    })
    .then(response => {
      return response;
    });
};
// 取得封面圖
export const getProjectImage = (projectId: number | null) => {
  return axios
    .get(`${host}/project/${projectId}/image`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${store.auth.getToken}`
      },
      responseType: 'blob'
    })
    .then(response => {
      if (response.status === 404) {
        throw new Error('Image not found');
      }
      return response;
    });
};

export const getProjectMember = (projectId: number) => {
  return axios.get(`${host}/project/member/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const deleteProject = (projectId: number, userId: string) => {
  return axios.delete(`${host}/project/${projectId}/${userId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const deleteProjectMember = (projectId: number, userId: string) => {
  return axios.delete(`${host}/project/member/${projectId}/${userId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const addProject = (projectName: string | null) => {
  return axios
    .post(
      `${host}/project/add`,
      {
        ProjectName: projectName
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${store.auth.getToken}`
        }
      }
    )
    .then(response => {
      return response;
    });
};

export const editProject = (
  projectId: number,
  projectName: string | (string | null)[],
) => {
  return axios
    .post(
      `${host}/project/edit`,
      {
        ProjectId: projectId,
        ProjectName: projectName,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${store.auth.getToken}`
        }
      }
    )
    .then(response => {
      console.log(response)
      return response;
    });
};

export const editProjectInfo = (
  projectId: number,
  projectInfo: string | null
) => {
  return axios
    .post(
      `${host}/project/editintro`,
      {
        ProjectId: projectId,
        Intro: projectInfo
      },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${store.auth.getToken}`
        }
      }
    )
    .then(response => {
      return response;
    });
};

export const editProjectCover = (
  projectId: number,
  file: File,
) => {
  const testnum = 'testformdatanum8888'
  const formData = new FormData();
  formData.append('file', file);
  formData.append('testnum', testnum);
  console.log('file',file);
  console.log('formdata',formData.keys);
  for (const entry of formData.entries()) {
    console.log(entry);
  }
  return axios
    .post(
      `${host}/project/${projectId}/editcover`, formData, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${store.auth.getToken}`
        }
      }
    )
    .then(response => {
      console.log(response);
      return response;
    });
};

export const editProjectNameByAdmin = (projectId: number, newInfo: any) => {
  return axios.patch(`${host}/project/${projectId}`, newInfo, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const deleteProjectByAdmin = (projectId: number) => {
  return axios.delete(`${host}/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const getProjectByAdmin: any = () => {
  return axios.get(`${host}/project/admin/`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};
