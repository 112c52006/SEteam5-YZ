import axios from "axios";
import { host } from "@/config/config";

import store from "@/store";

export const getBoardInfo = () => {
    return [{
        key: 'PD-17',
        summary: '身為開發者，我想依照設計開發Jira UI',
        status: "In Progress",
        labels: 'Frontend',
        priority: 'Highest',
        resolution: 'Null',
        description: "# 新增repo畫面:先選類型(github、gitlab、jira、sonarqube)>填URL>填其他該類repo需要的資訊(jira:boardId)\n!image-20211103-092426.png|width=1920,height=1067!\n在repository層級，可以添加不同類型的item(比如有github、jira、jenkins)\n!repo_with_LOGO.png|width=92.92035398230088%!\n\n## product backlog 頁面顯示全部的issues，有個filter(狀態、sprint、priority、label、點數)可以選怎麼排序。\n!jira_product_backlog.png|width=1440,height=780!\n## sprint 頁面可以看 backlog、goal、chart， 可以選看哪個sprint，只顯示該sprint的東西。\n!jira_sprint.png|width=1440,height=780!\n## board 頁面，只顯示不能改。\n!jira_board.png|width=1440,height=780!\n# ",
        subtask: false,
        storypoint: 13,
        subtasks: [{
            key: 'PD-36',
            summary: 'Board刻版',
            subtask: true,
            type: 'Subtask',
            priority: 'Medium',
            status: 'In Progress',
            resolution: 'Unresolved',
            created: 'Nov 3, 2021',
            updated: 'Nov 3, 2021'
        },
        {
            key: 'PD-29',
            summary: '手動測試',
            type: 'Subtask',
            subtask: true,
            priority: 'Lowest',
            status: 'Done',
            resolution: 'Done',
            created: 'Oct 20, 2021',
            updated: 'Nov 4, 2021'
        },
        {
            key: 'PD-30',
            summary: '手動測試2',
            type: 'Subtask',
            subtask: true,
            priority: 'Highest',
            status: 'To Do',
            resolution: 'Unresolved',
            created: 'Nov 3, 2021',
            updated: 'Nov 3, 2021'
        }]
    },
    {
        key: 'PD-99',
        summary: '測試用',
        status: "To Do",
        labels: 'Frontend',
        subtask: true,
        priority: 'High',
        resolution: 'Null',
        description: "None",
        storypoint: 5,
        subtasks: []
    },
    {
        key: 'PD-101',
        summary: 'Progress測試用',
        status: "In Progress",
        labels: 'Frontend',
        subtask: true,
        priority: 'High',
        resolution: 'Null',
        description: "None",
        storypoint: 21,
        subtasks: []
    },
    {
        key: 'PD-100',
        summary: 'Done測試用',
        status: "Done",
        labels: '',
        subtask: false,
        priority: 'High',
        resolution: 'Null',
        description: "None",
        storypoint: 5,
        subtasks: [{
            key: 'PD-200',
            summary: '手動測試2',
            type: 'Subtask',
            subtask: true,
            priority: 'Highest',
            status: 'To Do',
            resolution: 'Unresolved',
            created: 'Nov 3, 2021',
            updated: 'Nov 3, 2021'
        }]
    }];
};

export const getSprint = () => {
    return [{
        id: 4,
        self: "https://selab1623-pd.atlassian.net/rest/agile/1.0/sprint/4",
        state: "closed",
        name: "PD Sprint 1",
        startDate: "2021-10-20T10:39:08.585Z",
        endDate: "2021-11-02T16:00:00.000Z",
        completeDate: "2021-11-03T09:55:43.584Z",
        originBoardId: 1,
        goal: "1. Jira UI 設計完成\n2. 新增contribution的圓餅圖及柱狀圖"
    },
    {
        id: 6,
        self: "https://selab1623-pd.atlassian.net/rest/agile/1.0/sprint/6",
        state: "active",
        name: "PD Sprint 2",
        startDate: "2021-11-03T10:54:09.138Z",
        endDate: "2021-11-17T16:00:00.000Z",
        originBoardId: 1,
        goal: "照預覽圖完成Jira前端 UI"
    }];
};

export const getAllSubtasks = () => {
    return [
        { text: 'Key', value: 'key' /* sortable: false , align: ' d-none'*/ },
        { text: 'Summary', value: 'summary' },
        //{ text: 'Type', value: 'type' },
        { text: 'Status', value: 'status' },
        // { text: 'Priority', value: 'priority' },
        //{ text: 'Resolution', value: 'resolution' },
        //{ text: 'Created', value: 'created' },
        //{ text: 'Updated', value: 'updated' },
        //{ text: 'Label', value: 'label' },
        //{ text: 'Sprint', value: 'sprint' }
    ];
};