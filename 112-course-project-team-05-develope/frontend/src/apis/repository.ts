import axios from "axios";
import { host, mockHost } from "../config/config";
import store from "@/store";

export const getRepository = (projectId: string) => {
  return axios.get(`${host}/repo/${projectId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const addRepo: any = (
  projectId: number,
  url: string,
  isSonarqube: boolean,
  sonarqubeUrl: string,
  accountColonPassword: string,
  projectKey: string
) => {
  return axios.post(
    `${host}/repo`,
    {
      projectId: projectId,
      url: url,
      isSonarqube: isSonarqube,
      sonarqubeUrl: sonarqubeUrl,
      accountColonPassword: accountColonPassword,
      projectKey: projectKey
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const getJiraBoardInfo: any = (
  DomainURL: string,
  APIToken: string,
  Account: string,
  BoardId: number,
  ProjectId: number
) => {
  return axios.post(
    `${host}/jira/boardInfo`,
    {
      DomainURL: DomainURL,
      APIToken: APIToken,
      Account: Account,
      BoardId: BoardId,
      ProjectId: ProjectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const createJiraRepo: any = (
  DomainURL: string,
  APIToken: string,
  Account: string,
  BoardId: number,
  ProjectId: number
) => {
  return axios.post(
    `${host}/jira/createRepo`,
    {
      DomainURL: DomainURL,
      APIToken: APIToken,
      Account: Account,
      BoardId: BoardId,
      ProjectId: ProjectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

// 發送user綁定trello資訊的api
export const bindTrelloInfoPost: any = (key: string, token: string) => 
{
  return axios.post(
    `${host}/trello/bind`,
    {
      Key: key,
      Token: token,
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

// 發送清除user綁定的trello資訊的api
export const clearTrelloBindInfo: any = () => 
{
    return axios.get(`${host}/trello/clearTrelloBindInfo`, {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    });
};

// 發送檢查使用者是否有綁定trello資訊的api
export const checkTrelloKeyToken: any = () => 
{
  return axios.get(`${host}/trello/checkBind`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

// 發送檢查trello boardUrl是否符合的api
export const checkTrelloRepo: any = (name: string, boardUrl: string, projectId: number) => 
{
  return axios.post(
    `${host}/trello/checkBoardUrl`,
    {
      Name: name,
      BoardUrl: boardUrl,
      ProjectId: projectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

// 發送創建trello repo的api
export const createTrelloRepo: any = (name: string, boardUrl: string, projectId: number) => 
{
  return axios.post(
    `${host}/trello/createRepo`,
    {
      Name: name,
      BoardUrl: boardUrl,
      ProjectId: projectId
    },
    {
      headers: {
        Authorization: `Bearer ${store.auth.getToken}`
      }
    }
  );
};

export const deleteRepo: any = (projectId: number, repoId: number) => {
  return axios.delete(`${host}/repo/${projectId}/${repoId}`, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};
