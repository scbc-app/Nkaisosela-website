
import { SheetRow, SheetMetadata, AppContent, SpreadsheetUrls } from "../types";

export class SpreadsheetService {
  private requestQueue: Promise<any> = Promise.resolve();

  /**
   * Enterprise-grade request wrapper with concurrency locking.
   * Mirrors the LockService behavior of the reference script to prevent GAS collisions.
   */
  private async queuedRequest(url: string, payload: any): Promise<boolean> {
    // Add a small delay to ensure Google's servers are ready
    await new Promise(resolve => setTimeout(resolve, 500));

    this.requestQueue = this.requestQueue.then(async () => {
      try {
        console.log(`Cloud Ledger Request [${payload.action}]:`, payload.category || payload.sheet);
        
        // Use a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return true;
      } catch (e) {
        console.error("Cloud Ledger Error:", e);
        return false;
      }
    });
    
    return this.requestQueue;
  }

  getMockContent(): AppContent {
    return {
      services: [],
      blogs: [],
      careers: [],
      products: [],
      users: [{ Email: 'admin@nkaisosela.com', Password: 'admin', Role: 'Admin', Name: 'System Administrator' }],
      team: [],
      clients: [],
      faqs: [],
      testimonials: [],
      gallery: [],
      documents: [],
      settings: {}
    };
  }

  async fetchCloudDatabase(url: string): Promise<{ content: AppContent, metadata: SheetMetadata }> {
    if (!url) throw new Error("Cloud Proxy URL is not configured");
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to connect to spreadsheet cloud");
      const db = await response.json();

      // Professional mapping with fallback for both NKAISOSELA and Reference formats
      const content: AppContent = {
        services: (db.services || db.Services || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          title: r.title || r.Title || '',
          desc: r.desc || r.Desc || r.Description || r.description || '',
          category: r.category || r.Category || '',
          imageUrl: r.imageUrl || r.ImageUrl || r.Image || r.image || ''
        })),
        blogs: (db.blogs || db.Blogs || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          title: r.title || r.Title || '',
          author: r.author || r.Author || '',
          date: r.date || r.Date || '',
          excerpt: r.excerpt || r.Excerpt || '',
          imageUrl: r.imageUrl || r.ImageUrl || r.Image || r.image || ''
        })),
        careers: (db.careers || db.Careers || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          title: r.title || r.Title || '',
          department: r.department || r.Department || '',
          location: r.location || r.Location || '',
          type: r.type || r.Type || '',
          desc: r.desc || r.Desc || r.Description || r.description || ''
        })),
        products: (db.products || db.Products || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          Item: r.Item || r.item || '',
          Category: r.Category || r.category || '',
          Stock: r.Stock || r.stock || 0,
          Price: r.Price || r.price || 0,
          Unit: r.Unit || r.unit || '',
          Status: r.Status || r.status || '',
          imageUrl: r.imageUrl || r.ImageUrl || r.Image || r.image || ''
        })),
        users: (db.users || db.Users || []).length > 0 
          ? (db.users || db.Users).map((r: any) => ({
              Email: r.Email || r.email || r.username || r.Username || '',
              Password: String(r.Password || r.password || r.pass || r.Pass || ''),
              Role: r.Role || r.role || 'User',
              Name: r.Name || r.name || r.fullname || r.FullName || 'Anonymous',
              LastLogin: r.LastLogin || r.lastLogin || r.Last_Login || ''
            }))
          : this.getMockContent().users,
        team: (db.team || db.Team || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          name: r.name || r.Name || '',
          role: r.role || r.Role || '',
          imageUrl: r.imageUrl || r.ImageUrl || r.Image || r.image || '',
          bio: r.bio || r.Bio || ''
        })),
        clients: (db.clients || db.Clients || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          clientName: r.clientName || r.ClientName || r.Name || r.name || '',
          industry: r.industry || r.Industry || r.Sector || r.sector || '',
          logoUrl: r.logoUrl || r.LogoUrl || r.Logo || r.logo || r.imageUrl || r.ImageUrl || '',
          address: r.address || r.Address || '',
          details: r.details || r.Details || r.Description || r.description || ''
        })),
        faqs: (db.faqs || db.FAQs || db.faqs || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          question: r.question || r.Question || '',
          answer: r.answer || r.Answer || '',
          category: r.category || r.Category || 'General'
        })),
        testimonials: (db.testimonials || db.Testimonials || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          clientName: r.clientName || r.ClientName || '',
          companyName: r.companyName || r.CompanyName || '',
          rating: r.rating || r.Rating || 5,
          quote: r.quote || r.Quote || ''
        })),
        gallery: (db.gallery || db.Gallery || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          projectName: r.projectName || r.ProjectName || '',
          location: r.location || r.Location || '',
          imageUrl: r.imageUrl || r.ImageUrl || r.Image || r.image || '',
          description: r.description || r.Description || ''
        })),
        documents: (db.documents || db.Documents || []).map((r: any, i: number) => ({ 
          ...r, 
          id: r.id || i.toString(),
          docType: r.docType || r.DocType || '',
          docNumber: r.docNumber || r.DocNumber || '',
          clientName: r.clientName || r.ClientName || r.Customer || r.customer || '',
          date: r.date || r.Date || r.timestamp || r.Timestamp || r.createdAt || r.CreatedAt || '',
          amount: r.amount || r.Amount || r.total || r.Total || r.totalAmount || r.TotalAmount || '',
          status: r.status || r.Status || '',
          description: r.description || r.Description || ''
        })),
        settings: (db.settings || db.Settings || []).reduce((acc: any, r: any) => {
          const k = r.key || r.Key || r.Setting || r.setting;
          const v = r.value || r.Value || r.Content || r.content;
          if (k) acc[k] = v;
          return acc;
        }, {})
      };

      return {
        content,
        metadata: {
          name: "Nkaisosela Cloud Ledger",
          lastUpdated: new Date().toLocaleString(),
          rowCount: Object.values(db).reduce((acc: number, curr: any) => acc + (Array.isArray(curr) ? curr.length : 0), 0) as number,
          columns: content.products.length > 0 ? Object.keys(content.products[0]).filter(k => k !== 'id') : ['Item', 'Category', 'Stock', 'Price', 'Status']
        }
      };
    } catch (e) {
      console.error("Cloud Database Error:", e);
      throw e;
    }
  }

  /**
   * Aligned Save Record method.
   * Supports both NKAISOSELA (category/payload) and Reference (sheet/data) patterns.
   */
  async saveRecord(url: string, category: string, data: any, options: { idKey?: string, triggerEmail?: boolean, emailSubject?: string, emailHtml?: string } = {}): Promise<boolean> {
    const sheetName = category.charAt(0).toUpperCase() + category.slice(1);
    const idKey = options.idKey || 'id';
    const id = data[idKey] || data.id || data.Email || data.key || '';
    
    const payload = {
      // NKAISOSELA Pattern
      action: 'save',
      category: sheetName,
      payload: { ...data, id: id },
      
      // Reference Pattern (OmniTrack Alignment)
      sheet: sheetName,
      data: { ...data },
      id: id,
      idKey: idKey,
      
      // Scbc Alert Alignment
      triggerEmail: options.triggerEmail || false,
      emailSubject: options.emailSubject || '',
      emailHtml: options.emailHtml || ''
    };

    return this.queuedRequest(url, payload);
  }

  async deleteRecord(url: string, category: string, id: string): Promise<boolean> {
    const sheetName = category.charAt(0).toUpperCase() + category.slice(1);
    const payload = {
      // NKAISOSELA Pattern
      action: 'delete',
      category: sheetName,
      id: id,
      
      // Reference Pattern Alignment
      sheet: sheetName,
      sheetName: sheetName
    };

    return this.queuedRequest(url, payload);
  }

  /**
   * Aligned Batch Save method (Reference Pattern: batchCreate)
   */
  async saveBatch(url: string, category: string, rows: any[]): Promise<boolean> {
    const sheetName = category.charAt(0).toUpperCase() + category.slice(1);
    const payload = {
      action: 'batchCreate',
      sheet: sheetName,
      category: sheetName,
      rows: rows
    };
    return this.queuedRequest(url, payload);
  }

  async saveSettings(url: string, settings: Record<string, string>): Promise<boolean> {
    let allSuccess = true;
    for (const [key, value] of Object.entries(settings)) {
      // Use 'key' as the idKey for settings to ensure the backend script updates the correct row
      const success = await this.saveRecord(url, 'Settings', { key, value }, { idKey: 'key' });
      if (!success) allSuccess = false;
    }
    return allSuccess;
  }
}

export const spreadsheetService = new SpreadsheetService();
