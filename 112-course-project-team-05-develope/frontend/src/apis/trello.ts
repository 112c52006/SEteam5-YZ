import axios from "axios";
import { host } from "../config/config";
import store from "@/store";

export const getTrelloListById = (UserId: string, BoardId: string) => {
    return axios.post(`${host}/Trello/trelloLists`,
        {
            BoardId: BoardId,
            Account: UserId,
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${store.auth.getToken}`
            }
        },
    );
};

export const getTrelloCardById = (UserId: string, ListId: string) => {
    return axios.post(`${host}/Trello/trelloCardsInList`,
        {
            ListId: ListId,
            Account: UserId,
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${store.auth.getToken}`
            }
        },
    );
};

export const addNewCardToList = (UserId: string, ListId: string, CardName: string) => {
    return axios.post(`${host}/Trello/addTrelloCardInList`,
        {
            Account: UserId,
            ListId: ListId,
            Name: CardName
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${store.auth.getToken}`
            }
        },
    );
};

export const getCardInfo = (CardId: string) => {
    return axios.post(`${host}/Trello/trelloCardsInfo`,
        {
            CardId: CardId,
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${store.auth.getToken}`
            }
        },
    );
};

export const updateTrelloCard = (ListId: string, CardId: string, Desc: string, CardName: string) => {
    return axios.put(`${host}/Trello/updateTrelloCard`,
        {
            ListId: ListId,
            Desc: Desc,
            CardId: CardId,
            CardName: CardName
        },
        {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${store.auth.getToken}`
            }
        },
    );
};