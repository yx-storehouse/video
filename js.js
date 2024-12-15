let videos = [];
let currentEpisodes = [];
let editingIndex = -1;
// 添加当前编辑的索引变量
let editingEpisodeIndex = -1;
const showFormBtn = document.getElementById('showFormBtn');
const addVideoForm = document.getElementById('addVideoForm');
const videoForm = document.getElementById('videoForm');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addEpisodeBtn = document.getElementById('addEpisodeBtn');
const videoList = document.getElementById('videoList');
const episodeList = document.getElementById('episodeList');
const editIndexInput = document.getElementById('editIndex');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

// 添加一个全局变量来追踪最大的视频ID
let maxVideoId = 0;

showFormBtn.addEventListener('click', () => {
    showForm();
});

cancelBtn.addEventListener('click', () => {
    hideForm();
});

addEpisodeBtn.addEventListener('click', () => {
    if (editingEpisodeIndex === -1) {
        // 添加新剧��的逻辑保持不变
        const episodeData = {
            title: document.getElementById('episodeTitle').value,
            thumbnail: document.getElementById('thumbnail').value,
            duration: document.getElementById('duration').value,
            comments: parseInt(document.getElementById('comments').value),
            video: document.getElementById('video').value,
            index: currentEpisodes.length
        };
        currentEpisodes.push(episodeData);
    } else {
        // 更新已存在的剧集时，保持原有的 index
        const originalIndex = currentEpisodes[editingEpisodeIndex].index;
        currentEpisodes[editingEpisodeIndex] = {
            title: document.getElementById('episodeTitle').value,
            thumbnail: document.getElementById('thumbnail').value,
            duration: document.getElementById('duration').value,
            comments: parseInt(document.getElementById('comments').value),
            video: document.getElementById('video').value,
            index: originalIndex
        };
        editingEpisodeIndex = -1;
        addEpisodeBtn.textContent = "添加剧集";
    }
    
    // 清空输入框
    clearEpisodeForm();
    renderEpisodes();
});

// 添加清空剧集表单的函数
function clearEpisodeForm() {
    document.getElementById('episodeTitle').value = '';
    document.getElementById('thumbnail').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('comments').value = '';
    document.getElementById('video').value = '';
}

function renderEpisodes() {
    episodeList.innerHTML = '<h3>当前剧集列表</h3>';
    // 使用稳定的排序方法
    const sortedEpisodes = [...currentEpisodes].sort((a, b) => a.index - b.index);
    sortedEpisodes.forEach((episode, displayIndex) => {
        const episodeItem = document.createElement('div');
        episodeItem.className = 'episode-item';
        episodeItem.innerHTML = `
            <h4>${episode.title}</h4>
            <p>时长: ${episode.duration}</p>
            <p>索引: ${episode.index}</p>
            <div class="episode-buttons">
                <button type="button" class="edit-btn" onclick="editEpisode(${currentEpisodes.indexOf(episode)})">编辑</button>
                <button type="button" class="delete-btn" onclick="deleteEpisode(${currentEpisodes.indexOf(episode)})">删除</button>
            </div>
        `;
        episodeList.appendChild(episodeItem);
    });
}

function editEpisode(index) {
    event.preventDefault(); // 阻止默认行为
    event.stopPropagation(); // 阻止事件冒泡
    
    const episode = currentEpisodes[index];
    document.getElementById('episodeTitle').value = episode.title;
    document.getElementById('thumbnail').value = episode.thumbnail;
    document.getElementById('duration').value = episode.duration;
    document.getElementById('comments').value = episode.comments;
    document.getElementById('video').value = episode.video;
    editingEpisodeIndex = index;
    addEpisodeBtn.textContent = "保存修改";
}

function deleteEpisode(displayIndex) {
    currentEpisodes.splice(displayIndex, 1);
    // 重新计算索引以避免重复
    currentEpisodes.forEach((episode, index) => {
        episode.index = index;
    });
    renderEpisodes();
}

videoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const videoData = {
        id: editingIndex === -1 ? generateNewVideoId() : videos[editingIndex].id, // 保持原有ID或生成新ID
        title: document.getElementById('title').value,
        brand: document.getElementById('brand').value,
        image: document.getElementById('image').value,
        name: document.getElementById('name').value,
        info: document.getElementById('info').value,
        duration: 0,
        isFavorite: false,
        inwhatlist: false,
        guimie: currentEpisodes
    };
    
    if (editingIndex === -1) {
        videos.push(videoData);
    } else {
        videos[editingIndex] = videoData;
        editingIndex = -1;
    }
    renderVideos();
    hideForm();
    showExportButton();
});

function renderVideos() {
    videoList.innerHTML = '';
    videos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="${video.image}" alt="${video.title}">
            <div class="video-card-content">
                <h3>${video.title}</h3>
                <p>品牌: ${video.brand}</p>
                <p>ID: ${video.id}</p>
                <p>简介: ${video.info}</p>
                <p>剧集数: ${video.guimie.length}</p>
                <button class="edit-btn" onclick="editVideo(${index})">编辑</button>
                <button class="delete-btn" onclick="deleteVideo(${index})">删除</button>
            </div>
        `;
        videoList.appendChild(videoCard);
    });
}

function editVideo(index) {
    editingIndex = index;
    const video = videos[index];
    document.getElementById('title').value = video.title;
    document.getElementById('brand').value = video.brand;
    document.getElementById('image').value = video.image;
    document.getElementById('name').value = video.name;
    document.getElementById('info').value = video.info;
    currentEpisodes = [...video.guimie];
    renderEpisodes();
    showForm("编辑视频");
}

function deleteVideo(index) {
    videos.splice(index, 1);
    renderVideos();
    if (videos.length === 0) {
        hideExportButton();
    }
}

function showForm(title = "添加新视频") {
    formTitle.textContent = title;
    addVideoForm.classList.remove('hidden');
    editIndexInput.value = editingIndex;
}

function hideForm() {
    addVideoForm.classList.add('hidden');
    videoForm.reset();
    currentEpisodes = [];
    renderEpisodes();
    editingIndex = -1;
}

const exportBtn = document.getElementById('exportBtn');

function showExportButton() {
    exportBtn.classList.remove('hidden');
}

function hideExportButton() {
    exportBtn.classList.add('hidden');
}

exportBtn.addEventListener('click', exportData);

function exportData() {
    const animeList = videos.map(({ 
        title, 
        brand, 
        image, 
        name, 
        id, 
        info, 
        duration, 
        isFavorite, 
        inwhatlist,
        state,           // 添加新字段
        playProgress     // 添加新字段
    }) => ({
        title,
        brand,
        image,
        name,
        id,
        info,
        duration,
        isFavorite,
        inwhatlist,
        state,          // 添加新字段
        playProgress    // 添加新字段
    }));

    const episodes = videos.reduce((acc, video) => {
        acc[video.name] = video.guimie;
        return acc;
    }, {});

    const dataStr = `export const animeList = ${JSON.stringify(animeList, null, 2)};\n\nexport const episodes = ${JSON.stringify(episodes, null, 2)};`;
    
    const dataUri = 'data:application/javascript;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'anime_data.js';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
}

// 初始隐藏导出按钮
hideExportButton();

// 文件拖放和选择功能
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', handleFileDrop);
fileInput.addEventListener('change', handleFileSelect);

function handleFileDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
        readFile(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        readFile(file);
    }
}

function readFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            // 使用正则达式提取 animeList 和 episodes 的内容
            const animeListMatch = content.match(/export const animeList = (\[[\s\S]*?\]);/);
            const episodesMatch = content.match(/export const episodes = ({[\s\S]*?});/);
            
            if (animeListMatch && episodesMatch) {
                const animeList = JSON.parse(animeListMatch[1]);
                const episodes = JSON.parse(episodesMatch[1]);
                importData({ animeList, episodes });
            } else {
                throw new Error('无法找到 animeList 或 episodes 数据');
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('无法解析文件。请确保文件格式正确。');
        }
    };
    reader.readAsText(file);
}

function importData(data) {
    if (data.animeList && data.episodes) {
        // 找出已存在数据中的最大ID
        maxVideoId = Math.max(0, ...data.animeList.map(anime => anime.id || 0));
        
        videos = data.animeList.map(anime => ({
            id: anime.id || generateNewVideoId(), // 如果没有ID则生成新ID
            title: anime.title,
            brand: anime.brand,
            image: anime.image,
            name: anime.name,
            info: anime.info || "",
            duration: anime.duration || 0,
            isFavorite: anime.isFavorite || false,
            inwhatlist: anime.inwhatlist || false,
            state: anime.state || "online",
            playProgress: anime.playProgress || {
                currentTime: "0:00",
                duration: "00:00",
                index: 0,
                percentage: "0%"
            },
            guimie: data.episodes[anime.name] || []
        }));
        renderVideos();
        showExportButton();
        alert('数据已成功导入！');
    } else {
        alert('导入的数据格式不正确。');
    }
}

// 添加生成新视频ID的函数
function generateNewVideoId() {
    maxVideoId++;
    return maxVideoId-1;
}

