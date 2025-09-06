// ローカルファイル管理用のユーティリティ関数

class FileManager {
    constructor() {
        console.log('FileManager: 初期化開始');
        this.apiBase = 'http://localhost:3000/api';
        this.newsFile = 'data/news.json';
        this.draftsFile = 'data/drafts.json';
        this.newsData = [];
        this.loadNewsFromStorage();
        console.log('FileManager: 初期化完了');
    }

    // ローカルストレージからニュースデータを読み込み
    loadNewsFromStorage() {
        try {
            console.log('FileManager: ローカルストレージからデータ読み込み中...');
            const storedData = localStorage.getItem('newsData');
            if (storedData) {
                this.newsData = JSON.parse(storedData);
                console.log('FileManager: ローカルストレージから読み込んだデータ:', this.newsData);
            } else {
                console.log('FileManager: ローカルストレージにデータがありません');
                this.newsData = [];
            }
        } catch (error) {
            console.error('FileManager: ローカルストレージからの読み込みエラー:', error);
            this.newsData = [];
        }
    }

    // お知らせデータを読み込み
    async loadNews() {
        try {
            console.log('FileManager: loadNews呼び出し');
            
            // まずJSONファイルから読み込みを試行
            try {
                console.log('FileManager: JSONファイルから読み込み試行...');
                const response = await fetch(this.newsFile);
                if (response.ok) {
                    this.newsData = await response.json();
                    console.log('FileManager: JSONファイルから読み込んだデータ:', this.newsData);
                    // ローカルストレージにも保存
                    localStorage.setItem('newsData', JSON.stringify(this.newsData));
                    console.log('FileManager: 最終的なnewsData:', this.newsData);
                    return this.newsData;
                } else {
                    console.log('FileManager: JSONファイルが見つかりません');
                }
            } catch (error) {
                console.log('FileManager: JSONファイル読み込み失敗（CORSエラーの可能性）:', error);
            }
            
            // JSONファイルが読み込めない場合は、ローカルストレージから読み込み
            console.log('FileManager: ローカルストレージから読み込み試行...');
            this.loadNewsFromStorage();
            console.log('FileManager: ローカルストレージから読み込んだデータ:', this.newsData);
            
            // ローカルストレージにもデータがない場合は、空配列を返す
            if (this.newsData.length === 0) {
                console.log('FileManager: ローカルストレージにもデータがありません');
            }
            
            console.log('FileManager: 最終的なnewsData:', this.newsData);
            return this.newsData;
        } catch (error) {
            console.error('FileManager: loadNewsエラー:', error);
            return [];
        }
    }

    // お知らせデータを保存
    async saveNews(newsData) {
        try {
            console.log('FileManager: ニュースデータ保存開始:', newsData);
            this.newsData = newsData;
            
            // ローカルストレージに保存
            localStorage.setItem('newsData', JSON.stringify(newsData));
            console.log('FileManager: ローカルストレージに保存完了');
            
            // JSONファイルにも保存を試行
            try {
                const response = await fetch(`${this.apiBase}/news`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newsData)
                });
                
                if (response.ok) {
                    console.log('FileManager: JSONファイル保存成功');
                } else {
                    console.log('FileManager: JSONファイル保存失敗 - ステータス:', response.status);
                }
            } catch (error) {
                console.log('FileManager: JSONファイル保存失敗（ネットワークエラー）:', error);
                
                // フォールバック: 直接ファイルに保存を試行
                try {
                    const response = await fetch('/api/news', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newsData)
                    });
                    
                    if (response.ok) {
                        console.log('FileManager: 直接API保存成功');
                    }
                } catch (fallbackError) {
                    console.log('FileManager: 直接API保存も失敗:', fallbackError);
                }
            }
            
            return true;
        } catch (error) {
            console.error('FileManager: データ保存エラー:', error);
            return false;
        }
    }

    // 下書きデータを読み込み
    async loadDrafts() {
        try {
            // まずサーバーAPIを試行
            const response = await fetch(`${this.apiBase}/drafts`);
            if (response.ok) {
                const data = await response.json();
                const draftsArray = Array.isArray(data) ? data : [];
                // タイムスタンプ順でソート（新しい順）
                return draftsArray.sort((a, b) => {
                    const timestampA = new Date(a.timestamp || a.date);
                    const timestampB = new Date(b.timestamp || b.date);
                    return timestampB - timestampA; // 新しい順（降順）
                });
            }
        } catch (error) {
            console.log('Server API not available, trying local file...');
        }

        try {
            // フォールバック: ローカルファイルを試行
            const response = await fetch(this.draftsFile);
            if (response.ok) {
                const data = await response.json();
                const draftsArray = Array.isArray(data) ? data : [];
                // タイムスタンプ順でソート（新しい順）
                return draftsArray.sort((a, b) => {
                    const timestampA = new Date(a.timestamp || a.date);
                    const timestampB = new Date(b.timestamp || b.date);
                    return timestampB - timestampA; // 新しい順（降順）
                });
            }
        } catch (error) {
            console.log('Local file not available, using localStorage...');
        }

        // 最終フォールバック: ローカルストレージから読み込み
        const localData = localStorage.getItem('draftsData');
        const draftsArray = localData ? JSON.parse(localData) : [];
        // タイムスタンプ順でソート（新しい順）
        return draftsArray.sort((a, b) => {
            const timestampA = new Date(a.timestamp || a.date);
            const timestampB = new Date(b.timestamp || b.date);
            return timestampB - timestampA; // 新しい順（降順）
        });
    }

    // 下書きデータを保存
    async saveDrafts(draftsData) {
        try {
            // まずサーバーAPIを試行
            const response = await fetch(`${this.apiBase}/drafts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(draftsData)
            });
            
            if (response.ok) {
                // ローカルストレージにもバックアップ保存
                localStorage.setItem('draftsData', JSON.stringify(draftsData));
                console.log('Drafts data saved to server and localStorage:', draftsData);
                return true;
            }
        } catch (error) {
            console.log('Server API not available, saving to localStorage only...');
        }

        // フォールバック: ローカルストレージのみに保存
        try {
            localStorage.setItem('draftsData', JSON.stringify(draftsData));
            console.log('Drafts data saved to localStorage only:', draftsData);
            return true;
        } catch (error) {
            console.error('Error saving drafts to localStorage:', error);
            return false;
        }
    }

    // 新しいお知らせを追加
    async addNews(newsItem) {
        try {
            console.log('FileManager: 新しいニュース追加:', newsItem);
            const newsData = await this.loadNews();
            
            // IDを生成
            newsItem.id = this.generateId();
            newsItem.timestamp = new Date().toISOString();
            
            // 新しいお知らせを配列の先頭に追加
            newsData.unshift(newsItem);
            
            // 保存
            const success = await this.saveNews(newsData);
            console.log('FileManager: ニュース追加完了');
            return success ? newsItem : null;
        } catch (error) {
            console.error('FileManager: ニュース追加エラー:', error);
            return null;
        }
    }

    // お知らせを更新
    async updateNews(newsId, updatedData) {
        try {
            const newsData = await this.loadNews();
            const index = newsData.findIndex(news => news.id === newsId);
            
            if (index !== -1) {
                newsData[index] = { ...newsData[index], ...updatedData };
                const success = await this.saveNews(newsData);
                return success ? newsData[index] : null;
            }
            return null;
        } catch (error) {
            console.error('Error updating news:', error);
            return null;
        }
    }

    // お知らせを削除
    async deleteNews(newsId) {
        try {
            const newsData = await this.loadNews();
            const filteredData = newsData.filter(news => news.id !== newsId);
            
            const success = await this.saveNews(filteredData);
            return success;
        } catch (error) {
            console.error('Error deleting news:', error);
            return false;
        }
    }

    // 下書きを保存
    async saveDraft(draftItem) {
        try {
            const draftsData = await this.loadDrafts();
            
            // 既存の下書きを更新するか、新しい下書きを追加
            const existingIndex = draftsData.findIndex(draft => draft.id === draftItem.id);
            
            if (existingIndex !== -1) {
                draftsData[existingIndex] = { ...draftsData[existingIndex], ...draftItem };
            } else {
                draftItem.id = this.generateId();
                draftItem.timestamp = new Date().toISOString();
                draftsData.unshift(draftItem);
            }
            
            const success = await this.saveDrafts(draftsData);
            return success ? draftItem : null;
        } catch (error) {
            console.error('Error saving draft:', error);
            return null;
        }
    }

    // 下書きを削除
    async deleteDraft(draftId) {
        try {
            const draftsData = await this.loadDrafts();
            const filteredData = draftsData.filter(draft => draft.id !== draftId);
            
            const success = await this.saveDrafts(filteredData);
            return success;
        } catch (error) {
            console.error('Error deleting draft:', error);
            return false;
        }
    }

    // 一意のIDを生成
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // データをエクスポート
    exportData(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    // データをインポート
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// グローバルインスタンスを作成（重複防止）
if (!window.fileManager) {
    console.log('fileManager.js: グローバルインスタンス作成開始');
    window.fileManager = new FileManager();
    console.log('fileManager.js: グローバルインスタンス作成完了');
} else {
    console.log('fileManager.js: グローバルインスタンスは既に存在します');
} 