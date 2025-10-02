import { BlogPost } from '../data/blogData';

const BLOG_POSTS_KEY = 'blog_posts_data';
const IMAGES_KEY = 'uploaded_images';
const PAGE_CONTENT_KEY = 'page_content_data';

export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface PageContent {
  pageId: string;
  title?: string;
  subtitle?: string;
  content?: string;
  images?: string[];
  updatedAt: string;
}

export const StorageService = {
  getBlogPosts(): BlogPost[] {
    const data = localStorage.getItem(BLOG_POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBlogPosts(posts: BlogPost[]): void {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  },

  addBlogPost(post: BlogPost): void {
    const posts = this.getBlogPosts();
    posts.unshift(post);
    this.saveBlogPosts(posts);
  },

  updateBlogPost(id: string, updatedPost: Partial<BlogPost>): void {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost };
      this.saveBlogPosts(posts);
    }
  },

  deleteBlogPost(id: string): void {
    const posts = this.getBlogPosts();
    const filtered = posts.filter(p => p.id !== id);
    this.saveBlogPosts(filtered);
  },

  getImages(): UploadedImage[] {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveImage(image: UploadedImage): void {
    const images = this.getImages();
    images.unshift(image);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  },

  deleteImage(id: string): void {
    const images = this.getImages();
    const filtered = images.filter(img => img.id !== id);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(filtered));
  },

  getPageContent(pageId: string): PageContent | null {
    const data = localStorage.getItem(PAGE_CONTENT_KEY);
    const allContent: PageContent[] = data ? JSON.parse(data) : [];
    return allContent.find(c => c.pageId === pageId) || null;
  },

  savePageContent(content: PageContent): void {
    const data = localStorage.getItem(PAGE_CONTENT_KEY);
    const allContent: PageContent[] = data ? JSON.parse(data) : [];
    const index = allContent.findIndex(c => c.pageId === content.pageId);

    if (index !== -1) {
      allContent[index] = content;
    } else {
      allContent.push(content);
    }

    localStorage.setItem(PAGE_CONTENT_KEY, JSON.stringify(allContent));
  },

  getAllPageContent(): PageContent[] {
    const data = localStorage.getItem(PAGE_CONTENT_KEY);
    return data ? JSON.parse(data) : [];
  }
};
