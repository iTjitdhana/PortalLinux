# Subsystem API Documentation

## Overview
API endpoints for managing and retrieving subsystem information including images.

## Endpoints

### Get All Subsystems
**GET** `/api/dashboard/subsystems`

Retrieves all active subsystems with their associated department information and image URLs.

#### Query Parameters
- `departmentId` (optional): Filter subsystems by department ID

#### Response
```json
{
  "success": true,
  "data": {
    "subsystems": [
      {
        "id": 1,
        "name": "ระบบจัดการแผนการผลิต",
        "slug": "production-planning",
        "url": "http://192.168.0.94:3012/",
        "imageUrl": "/existing/images/production-planning.png",
        "sortOrder": 1,
        "department": {
          "id": 1,
          "nameTh": "ระบบจัดการผลิต",
          "nameEn": "Production Management"
        }
      }
    ]
  }
}
```

### Get Subsystem by ID
**GET** `/api/dashboard/subsystems/:id`

Retrieves a specific subsystem by its ID.

#### Path Parameters
- `id`: The subsystem ID

#### Response
```json
{
  "success": true,
  "data": {
    "subsystem": {
      "id": 1,
      "name": "ระบบจัดการแผนการผลิต",
      "slug": "production-planning",
      "url": "http://192.168.0.94:3012/",
      "imageUrl": "/existing/images/production-planning.png",
      "sortOrder": 1,
      "createdAt": "2025-01-26T00:00:00.000Z",
      "updatedAt": "2025-01-26T00:00:00.000Z",
      "department": {
        "id": 1,
        "nameTh": "ระบบจัดการผลิต",
        "nameEn": "Production Management"
      }
    }
  }
}
```

## Database Schema

### Subsystem Table
```sql
CREATE TABLE `subsystem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `departmentId` bigint NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL UNIQUE,
  `url` varchar(191) NOT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`)
);
```

## Usage Examples

### Frontend Integration
```javascript
// Fetch all subsystems
const response = await fetch('/api/dashboard/subsystems');
const data = await response.json();

// Display subsystem with image
data.data.subsystems.forEach(subsystem => {
  if (subsystem.imageUrl) {
    const img = document.createElement('img');
    img.src = subsystem.imageUrl;
    img.alt = subsystem.name;
    // Add to DOM
  }
});
```

### Filter by Department
```javascript
// Get only production subsystems
const response = await fetch('/api/dashboard/subsystems?departmentId=1');
const data = await response.json();
```

## Image Management

### Adding Images
1. Place image files in `/frontend/public/existing/images/`
2. Update the `imageUrl` field in the database
3. Use relative paths starting with `/existing/images/`

### Supported Image Formats
- PNG (recommended)
- JPG/JPEG
- SVG
- WebP

### Image Naming Convention
- Use kebab-case: `production-planning.png`
- Include system type: `hr-employee-management.png`
- Keep file sizes optimized for web use
