// src/services/contentService.js
import axios from 'axios';
import authService from './authService';
import { SERVER_URL } from '../config'; // <--- BU SATIR EKLENDİ

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { headers: { Authorization: `Bearer ${user.token}` } };
    } else {
        return {};
    }
};

// İstatistikleri Getir
const getStats = async () => {
    // URL'lerin başına ${SERVER_URL} eklendi
    const response = await axios.get(`${SERVER_URL}/api/stats`);
    return response.data;
};

// Ziyaretçi Kaydı Oluştur
const recordVisit = async () => {
    await axios.post(`${SERVER_URL}/api/stats/visit`);
};

// Duyuruları Getir
const getAnnouncements = async () => {
    const response = await axios.get(`${SERVER_URL}/api/announcements`);
    return response.data;
};

// Duyuru Ekle
const addAnnouncement = async (announcementData) => {
    const response = await axios.post(
        `${SERVER_URL}/api/announcements`, 
        announcementData, 
        getAuthHeader()
    );
    return response.data;
};

// Duyuru Sil
const deleteAnnouncement = async (id) => {
    const response = await axios.delete(
        `${SERVER_URL}/api/announcements/${id}`, 
        getAuthHeader()
    );
    return response.data;
};

// --- PORTFÖY İŞLEMLERİ ---
const getPortfolios = async () => {
    const response = await axios.get(`${SERVER_URL}/api/portfolio`);
    return response.data;
};

const addPortfolio = async (formData) => {
    const response = await axios.post(`${SERVER_URL}/api/portfolio`, formData, getAuthHeader());
    return response.data;
};

const deletePortfolio = async (id) => {
    const response = await axios.delete(`${SERVER_URL}/api/portfolio/${id}`, getAuthHeader());
    return response.data;
};

// --- BLOG ---
const getBlogs = async () => {
    const response = await axios.get(`${SERVER_URL}/api/blogs`);
    return response.data;
};

const addBlog = async (formData) => {
    const response = await axios.post(`${SERVER_URL}/api/blogs`, formData, getAuthHeader());
    return response.data;
};

const deleteBlog = async (id) => {
    const response = await axios.delete(`${SERVER_URL}/api/blogs/${id}`, getAuthHeader());
    return response.data;
};

// --- MESAJ İŞLEMLERİ (Sorunlu olan kısım burasıydı) ---
const sendMessage = async (messageData) => {
    // Artık istek doğru adrese gidecek: https://kiyi.trackbangserver.com/api/messages
    const response = await axios.post(`${SERVER_URL}/api/messages`, messageData);
    return response.data;
};

const getMessages = async () => {
    const response = await axios.get(`${SERVER_URL}/api/messages`, getAuthHeader());
    return response.data;
};

const deleteMessage = async (id) => {
    const response = await axios.delete(`${SERVER_URL}/api/messages/${id}`, getAuthHeader());
    return response.data;
};

const contentService = {
    getStats,
    recordVisit,
    getAnnouncements,
    addAnnouncement,
    deleteAnnouncement,
    getPortfolios,
    addPortfolio,
    deletePortfolio,
    sendMessage,
    getMessages,
    deleteMessage,
    getBlogs,
    addBlog,
    deleteBlog
};

export default contentService;