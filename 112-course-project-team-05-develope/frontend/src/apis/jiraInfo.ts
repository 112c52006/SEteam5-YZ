import axios from "axios";
import { host } from "@/config/config";
import store from "@/store";

export const getAllJiraIssue = (repoId:any) => {
  return axios.post(`${host}/jira/issue`,{
    RepoId: repoId,
  }, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
};

export const getAllJiraField = () => {
  return [
    { text: 'Summary', value: 'summary', disabled: true },
    { text: 'Type', value: 'type', disabled: true },
    { text: 'Status', value: 'status', disabled: true },
    { text: 'Priority', value: 'priority', disabled: true },
    { text: 'Key', value: 'key' /* sortable: false , align: ' d-none'*/ },
    { text: 'Resolution', value: 'resolution' },
    { text: 'Created', value: 'created' },
    { text: 'Updated', value: 'updated' },
    { text: 'Label', value: 'label' },
    // { text: 'Sprint', value: 'sprint' }
  ];
};

export const getJiraInfoFake = () => {
  return [{
    key: 'PD-36',
    summary: 'Board刻版',
    type:'Subtask',
    priority: 'Medium',
    status: 'In Progress',
    resolution: 'Unresolved',
    created: 'Nov 3, 2021',
    updated: 'Nov 3, 2021'
  },
  {
    key: 'PD-29',
    summary: '手動測試',
    type:'Subtask',
    priority: 'Lowest',
    status: 'Done',
    resolution: 'Done',
    created: 'Oct 20, 2021',
    updated: 'Nov 4, 2021'
  },
  {
    key: 'PD-30',
    summary: '身為開發者，我想新增Jira的API',
    type:'Task',
    priority: 'Highest',
    status: 'To Do',
    resolution: 'Unresolved',
    created: 'Nov 3, 2021',
    updated: 'Nov 3, 2021'
  },
  {
    key: 'PD-100',
    summary: 'Created on November 2',
    type:'Subtask',
    priority: 'Low',
    status: 'To Do',
    resolution: 'Unresolved',
    created: 'Nov 2, 2021',
    updated: 'Nov 6, 2021'
  },
  {
    key: 'PD-101',
    summary: 'Created on November 4',
    type:'Subtask',
    priority: 'Low',
    status: 'To Do',
    resolution: 'Unresolved',
    created: 'Nov 4, 2021',
    updated: 'Nov 6, 2021'
  },
  {
    key: 'PD-102',
    summary: 'Created on November 5',
    type:'Subtask',
    priority: 'Medium',
    status: 'To Do',
    resolution: 'Unresolved',
    created: 'Nov 5, 2021',
    updated: 'Nov 6, 2021'
  },
  {
    key: 'PD-103',
    summary: 'Created on November 6',
    type:'Subtask',
    priority: 'High',
    status: 'To Do',
    resolution: 'Unresolved',
    created: 'Nov 6, 2021',
    updated: 'Nov 6, 2021'
  }];
};

export const getSprintInfo = (repoId:any) => {
  return axios.post(`${host}/jira/sprint`,{
    RepoId: repoId,
  }, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
}

export const getIssueInfo = (repoId:any, sprintId:any) => {
  return axios.post(`${host}/jira/issueInfo`,{
    RepoId: repoId,
    SprintId: sprintId
  }, {
    headers: {
      Authorization: `Bearer ${store.auth.getToken}`
    }
  });
  // return [{
  //     sprintId:'1',
  //     id:'11',
  //     name: 'TFJA Issue 11',
  //     status: 'Done',
  //     point: '5'
  //   },
  //   {
  //     sprintId:'1',
  //     id:'12',
  //     name: 'TFJA Issue 12',
  //     status: 'Done',
  //     point: '13'
  //   }]
}