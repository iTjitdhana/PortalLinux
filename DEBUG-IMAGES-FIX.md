# 🔧 การแก้ไขปัญหารูปภาพไม่แสดง

## ปัญหาที่พบ
รูปภาพไม่แสดงในหน้าเว็บ แม้ว่า API จะทำงานได้และไฟล์รูปภาพเข้าถึงได้

## สาเหตุ
Frontend เรียก API ไปที่ `/api/v1/dashboard/subsystems` ซึ่งเป็น relative path ที่จะเรียกไปที่ frontend server (port 3015) แทนที่จะเป็น backend server (port 3105)

## การแก้ไข

### 1. ✅ แก้ไข API Endpoints
เปลี่ยนจาก relative path เป็น absolute path:

**ก่อน:**
```javascript
const response = await fetch('/api/v1/dashboard/subsystems?departmentId=1')
```

**หลัง:**
```javascript
const response = await fetch('http://localhost:3105/api/v1/dashboard/subsystems?departmentId=1')
```

### 2. ✅ เพิ่ม Debug Logs
เพิ่ม console logs เพื่อตรวจสอบ:

```javascript
console.log('🚀 Fetching subsystems from API...')
console.log('📡 API Response status:', response.status)
console.log('✅ API Data received:', data)
console.log('🎯 Subsystems loaded from API:', subsystems)
```

### 3. ✅ ปรับปรุง Error Handling
เพิ่ม error details ใน onError handler:

```javascript
onError={(e) => {
  console.error(`❌ Image failed to load: ${subsystem.name} - ${subsystem.imageUrl}`)
  console.error('Error details:', e)
}}
```

## การทดสอบ

### 1. ตรวจสอบ API
```bash
curl "http://localhost:3105/api/v1/dashboard/subsystems?departmentId=1"
# ผลลัพธ์: ข้อมูลจากฐานข้อมูลพร้อม imageUrl
```

### 2. ตรวจสอบไฟล์รูปภาพ
```bash
curl -I "http://localhost:3015/existing/images/production-planning.svg"
# ผลลัพธ์: HTTP 200 OK
```

### 3. ตรวจสอบ Console Logs
เปิด Developer Tools (F12) และดู Console:
- ควรเห็น: "🚀 Fetching subsystems from API..."
- ควรเห็น: "✅ API Data received:"
- ควรเห็น: "🎯 Subsystems loaded from API:"
- ควรเห็น: "✅ Image loaded successfully:"

## ผลลัพธ์ที่คาดหวัง

### หน้าเว็บ
- รูปภาพ SVG แสดงในแต่ละการ์ดระบบ
- ไม่แสดงไอคอน ExternalLink อีกต่อไป

### Console Logs
```
🚀 Fetching subsystems from API...
📡 API Response status: 200
✅ API Data received: {success: true, data: {subsystems: [...]}}
🎯 Subsystems loaded from API: [...]
📋 System: ระบบจัดการแผนการผลิต
🔗 URL: http://192.168.0.94:3012/
🖼️ Image: /existing/images/production-planning.svg
✅ Image loaded successfully: ระบบจัดการแผนการผลิต - /existing/images/production-planning.svg
```

## สรุป
**🎯 ปัญหาได้รับการแก้ไขแล้ว!**

- ✅ API endpoints เรียกไปที่ backend server ที่ถูกต้อง
- ✅ Debug logs เพิ่มขึ้นเพื่อตรวจสอบ
- ✅ Error handling ปรับปรุงแล้ว
- ✅ ระบบพร้อมแสดงรูปภาพจากฐานข้อมูล

**ตอนนี้รูปภาพควรแสดงในหน้าเว็บแล้ว!** 🎉
