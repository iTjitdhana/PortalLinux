# ระบบแสดงรูปภาพ Subsystem

## ภาพรวม
ระบบนี้แสดงรูปภาพของแต่ละ subsystem ที่ดึงมาจากฐานข้อมูลผ่าน API

## ไฟล์ที่เกี่ยวข้อง

### 1. รูปภาพ SVG
- `production-planning.svg` - รูปภาพสำหรับระบบจัดการแผนการผลิต
- `production-process.svg` - รูปภาพสำหรับระบบจัดการกระบวนการผลิต  
- `production-timing.svg` - รูปภาพสำหรับระบบจับเวลาการผลิต
- `kitchen-schedule.svg` - รูปภาพสำหรับตารางงานการผลิตสินค้าครัวกลาง
- `employee-management.svg` - รูปภาพสำหรับระบบจัดการพนักงาน

### 2. API Endpoints
- `GET /api/dashboard/subsystems` - ดึงข้อมูล subsystem ทั้งหมด
- `GET /api/dashboard/subsystems?departmentId=1` - ดึงข้อมูล subsystem ของแผนกผลิต

### 3. ฐานข้อมูล
- ตาราง `subsystem` มีคอลัมน์ `imageUrl` เก็บ path ของรูปภาพ
- Seeder ไฟล์: `backend/src/database/seeders/20250126000001-seed-subsystems.js`

## การทำงาน

### 1. ดึงข้อมูลจาก API
```javascript
const response = await fetch('/api/dashboard/subsystems?departmentId=1')
const data = await response.json()
setSubsystems(data.data.subsystems || [])
```

### 2. แสดงรูปภาพ
```jsx
{subsystem.imageUrl ? (
  <img
    src={subsystem.imageUrl}
    alt={subsystem.name}
    className="w-full h-full rounded-full object-cover"
    onError={(e) => {
      // Fallback to icon if image fails to load
    }}
  />
) : (
  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
    <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
  </div>
)}
```

### 3. Loading State
- แสดง skeleton loading ขณะดึงข้อมูล
- มี fallback ข้อมูลหาก API ไม่ทำงาน

## การเพิ่มรูปภาพใหม่

### 1. สร้างไฟล์ SVG
```bash
# สร้างไฟล์ในโฟลเดอร์
frontend/public/existing/images/new-system.svg
```

### 2. อัปเดตฐานข้อมูล
```sql
UPDATE subsystem 
SET imageUrl = '/existing/images/new-system.svg' 
WHERE slug = 'new-system';
```

### 3. หรือใช้ Seeder
```javascript
{
  id: 6,
  departmentId: 1,
  name: 'ระบบใหม่',
  slug: 'new-system',
  url: 'http://example.com',
  imageUrl: '/existing/images/new-system.svg',
  sortOrder: 5,
  isActive: true
}
```

## การแก้ไขปัญหา

### รูปภาพไม่แสดง
1. ตรวจสอบ path ของไฟล์รูปภาพ
2. ตรวจสอบว่าไฟล์มีอยู่จริงในโฟลเดอร์
3. ดู console log สำหรับ error

### API ไม่ทำงาน
- ระบบจะใช้ fallback ข้อมูลจาก hardcoded array
- รูปภาพจะใช้ path ตาม slug ของระบบ

### รูปภาพไม่โหลด
- ระบบมี fallback แสดงไอคอน ExternalLink
- ตรวจสอบ network tab ใน browser dev tools

## การปรับแต่ง

### เปลี่ยนขนาดรูปภาพ
```jsx
<div className="w-12 h-12 lg:w-16 lg:h-16"> // เปลี่ยนขนาด
  <img className="w-full h-full rounded-full object-cover" />
</div>
```

### เปลี่ยนสไตล์
```jsx
<img 
  className="w-full h-full rounded-lg object-cover" // เปลี่ยนจาก rounded-full เป็น rounded-lg
/>
```

### เพิ่มเอฟเฟกต์
```jsx
<img 
  className="w-full h-full rounded-full object-cover hover:scale-110 transition-transform duration-200"
/>
```
