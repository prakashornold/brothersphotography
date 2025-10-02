import { supabase, BlogPost, Image, PageContent } from '../lib/supabase';

export const DatabaseService = {
  async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }

    return data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return null;
    }

    return data;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  },

  async getImages(): Promise<Image[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    return data || [];
  },

  async uploadImage(image: Omit<Image, 'id' | 'uploaded_at'>): Promise<Image | null> {
    const { data, error } = await supabase
      .from('images')
      .insert([image])
      .select()
      .single();

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return data;
  },

  async deleteImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  },

  async getPageContent(pageId: string): Promise<PageContent | null> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_id', pageId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching page content:', error);
      return null;
    }

    return data;
  },

  async savePageContent(content: Omit<PageContent, 'id' | 'updated_at'>): Promise<PageContent | null> {
    const { data: existing } = await supabase
      .from('page_content')
      .select('id')
      .eq('page_id', content.page_id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('page_content')
        .update({ ...content, updated_at: new Date().toISOString() })
        .eq('page_id', content.page_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating page content:', error);
        return null;
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('page_content')
        .insert([content])
        .select()
        .single();

      if (error) {
        console.error('Error creating page content:', error);
        return null;
      }

      return data;
    }
  },

  async getAllPageContent(): Promise<PageContent[]> {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching all page content:', error);
      return [];
    }

    return data || [];
  },

  async getLandingPageImages(section?: string): Promise<any[]> {
    let query = supabase
      .from('landing_page_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching landing page images:', error);
      return [];
    }

    return data || [];
  },

  async createLandingPageImage(image: any): Promise<any> {
    const { data, error } = await supabase
      .from('landing_page_images')
      .insert([image])
      .select()
      .single();

    if (error) {
      console.error('Error creating landing page image:', error);
      return null;
    }

    return data;
  },

  async updateLandingPageImage(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('landing_page_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating landing page image:', error);
      return null;
    }

    return data;
  },

  async deleteLandingPageImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('landing_page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting landing page image:', error);
      return false;
    }

    return true;
  },

  async getHomePageImages(category?: string): Promise<any[]> {
    let query = supabase
      .from('home_page_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching home page images:', error);
      return [];
    }

    return data || [];
  },

  async createHomePageImage(image: any): Promise<any> {
    const { data, error } = await supabase
      .from('home_page_images')
      .insert([image])
      .select()
      .single();

    if (error) {
      console.error('Error creating home page image:', error);
      return null;
    }

    return data;
  },

  async updateHomePageImage(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('home_page_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating home page image:', error);
      return null;
    }

    return data;
  },

  async deleteHomePageImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('home_page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting home page image:', error);
      return false;
    }

    return true;
  },

  async bulkDeleteHomePageImages(ids: string[]): Promise<boolean> {
    const { error } = await supabase
      .from('home_page_images')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting home page images:', error);
      return false;
    }

    return true;
  },

  async bulkUpdateHomePageImages(ids: string[], updates: any): Promise<boolean> {
    const { error } = await supabase
      .from('home_page_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .in('id', ids);

    if (error) {
      console.error('Error bulk updating home page images:', error);
      return false;
    }

    return true;
  },

  async getSiteSetting(key: string): Promise<any> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', key)
      .maybeSingle();

    if (error) {
      console.error('Error fetching site setting:', error);
      return null;
    }

    return data;
  },

  async updateSiteSetting(key: string, value: string, type: string = 'text'): Promise<any> {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('setting_key', key)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ setting_value: value, setting_type: type, updated_at: new Date().toISOString() })
        .eq('setting_key', key)
        .select()
        .single();

      if (error) {
        console.error('Error updating site setting:', error);
        return null;
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert([{ setting_key: key, setting_value: value, setting_type: type }])
        .select()
        .single();

      if (error) {
        console.error('Error creating site setting:', error);
        return null;
      }

      return data;
    }
  }
};
