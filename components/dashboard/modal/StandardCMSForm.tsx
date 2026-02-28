
import React from 'react';
import { FormField, ImageUploadField } from './FormFields';
import { ManagementTab } from '../ManagementSection';

interface StandardCMSFormProps {
  activeTab: ManagementTab;
  formData: any;
  handleInputChange: (e: any) => void;
  handleImageUpload: (e: any) => void;
  uploading: boolean;
}

const StandardCMSForm: React.FC<StandardCMSFormProps> = ({
  activeTab, formData, handleInputChange, handleImageUpload, uploading
}) => {
  switch (activeTab) {
    case 'products':
      return (
        <>
          <FormField label="Item Name" name="Item" value={formData.Item || ''} onChange={handleInputChange} required placeholder="Name" />
          <FormField label="Category" name="Category" value={formData.Category || ''} onChange={handleInputChange} type="select" options={['PPE', 'Construction', 'Electrical', 'IT Equipment', 'Machinery', 'General Supply']} />
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Stock" name="Stock" value={formData.Stock || ''} onChange={handleInputChange} type="number" />
            <FormField label="Price" name="Price" value={formData.Price || ''} onChange={handleInputChange} type="number" />
          </div>
          <FormField label="Unit" name="Unit" value={formData.Unit || 'Pairs'} onChange={handleInputChange} />
          <FormField label="Status" name="Status" value={formData.Status || 'Available'} onChange={handleInputChange} type="select" options={['Available', 'Low Stock', 'Out of Stock', 'Discontinued']} />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Description" name="desc" value={formData.desc || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Product Image" value={formData.imageUrl} onUpload={handleImageUpload} loading={uploading} compact /></div>
        </>
      );
    case 'services':
      return (
        <>
          <FormField label="Service Title" name="title" value={formData.title || ''} onChange={handleInputChange} required />
          <FormField label="Category" name="category" value={formData.category || ''} onChange={handleInputChange} type="select" options={['Logistics', 'Construction', 'General Supply', 'Technical Consultancy']} />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Description" name="desc" value={formData.desc || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Image" value={formData.imageUrl} onUpload={handleImageUpload} loading={uploading} compact /></div>
        </>
      );
    case 'blogs':
      return (
        <>
          <FormField label="Post Title" name="title" value={formData.title || ''} onChange={handleInputChange} required />
          <FormField label="Category" name="category" value={formData.category || ''} onChange={handleInputChange} />
          <FormField label="Author" name="author" value={formData.author || ''} onChange={handleInputChange} />
          <FormField label="Date" name="date" value={formData.date || ''} onChange={handleInputChange} type="date" />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Excerpt" name="excerpt" value={formData.excerpt || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Header Image" value={formData.imageUrl} onUpload={handleImageUpload} loading={uploading} compact /></div>
        </>
      );
    case 'careers':
      return (
        <>
          <FormField label="Role Title" name="title" value={formData.title || ''} onChange={handleInputChange} required />
          <FormField label="Department" name="department" value={formData.department || ''} onChange={handleInputChange} />
          <FormField label="Work Location" name="location" value={formData.location || 'Kapiri Mposhi'} onChange={handleInputChange} />
          <FormField label="Contract Type" name="type" value={formData.type || 'Full-time'} onChange={handleInputChange} type="select" options={['Full-time', 'Part-time', 'Contract', 'Internship']} />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Job Requirements & Brief" name="desc" value={formData.desc || ''} onChange={handleInputChange} type="textarea" /></div>
        </>
      );
    case 'clients':
      return (
        <>
          <FormField label="Partner/Client Name" name="clientName" value={formData.clientName || ''} onChange={handleInputChange} required />
          <FormField label="Sector" name="industry" value={formData.industry || ''} onChange={handleInputChange} />
          <FormField label="Business Address" name="address" value={formData.address || ''} onChange={handleInputChange} />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Partnership Details" name="details" value={formData.details || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Corporate Logo" value={formData.logoUrl} onUpload={handleImageUpload} loading={uploading} /></div>
        </>
      );
    case 'faqs':
      return (
        <>
          <FormField label="Question" name="question" value={formData.question || ''} onChange={handleInputChange} required />
          <FormField label="Category" name="category" value={formData.category || 'General'} onChange={handleInputChange} />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Answer" name="answer" value={formData.answer || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
        </>
      );
    case 'testimonials':
      return (
        <>
          <FormField label="Client Name" name="clientName" value={formData.clientName || ''} onChange={handleInputChange} required />
          <FormField label="Company Name" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} />
          <FormField label="Star Rating (1-5)" name="rating" value={formData.rating || 5} onChange={handleInputChange} type="number" />
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Client Quote" name="quote" value={formData.quote || ''} onChange={handleInputChange} type="textarea" /></div>
        </>
      );
    case 'gallery':
      return (
        <>
          <FormField label="Project Title" name="projectName" value={formData.projectName || ''} onChange={handleInputChange} required />
          <FormField label="Location" name="location" value={formData.location || ''} onChange={handleInputChange} />
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Showcase Image" value={formData.imageUrl} onUpload={handleImageUpload} loading={uploading} compact /></div>
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Brief" name="description" value={formData.description || ''} onChange={handleInputChange} type="textarea" rows={2} /></div>
        </>
      );
    case 'team':
      return (
        <>
          <FormField label="Staff Name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
          <FormField label="Position/Role" name="role" value={formData.role || ''} onChange={handleInputChange} />
          <div className="sm:col-span-2 md:col-span-3"><ImageUploadField label="Staff Profile Photo" value={formData.imageUrl} onUpload={handleImageUpload} loading={uploading} /></div>
          <div className="sm:col-span-2 md:col-span-3"><FormField label="Profile Bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} type="textarea" /></div>
        </>
      );
    default: return null;
  }
};

export default StandardCMSForm;
