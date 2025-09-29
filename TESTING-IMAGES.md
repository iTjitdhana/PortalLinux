# การทดสอบการแสดงรูปภาพ Subsystem

## สถานะปัจจุบัน
✅ ไฟล์ SVG ถูกสร้างแล้ว
✅ ข้อมูลถูกเพิ่มในฐานข้อมูลแล้ว  
✅ Frontend server ทำงานแล้ว
✅ ไฟล์ SVG สามารถเข้าถึงได้ผ่าน HTTP

## วิธีการทดสอบ

### 1. เข้าไปที่หน้าเว็บ
```
http://localhost:3015
```

### 2. คลิกที่ "ระบบจัดการผลิต"
- ควรเห็น 4 ระบบแสดงขึ้นมา
- แต่ละระบบควรมีรูปภาพ SVG แทนไอคอน ExternalLink

### 3. ตรวจสอบ Console Log
เปิด Developer Tools (F12) และดู Console:
- ควรเห็น log: "Subsystems loaded: [...]"
- ควรเห็น log: "✅ Image loaded successfully: [ชื่อระบบ] - [path]"

### 4. ตรวจสอบ Network Tab
ใน Developer Tools > Network:
- ควรเห็นการโหลดไฟล์ SVG
- Status ควรเป็น 200 OK

## ไฟล์ที่เกี่ยวข้อง

### รูปภาพ SVG
- `/frontend/public/existing/images/production-planning.svg`
- `/frontend/public/existing/images/production-process.svg`
- `/frontend/public/existing/images/production-timing.svg`
- `/frontend/public/existing/images/kitchen-schedule.svg`

### ข้อมูลในฐานข้อมูล
```sql
SELECT id, name, imageUrl FROM subsystem WHERE departmentId = 1;
```

### API Endpoint
```
GET http://localhost:3105/api/dashboard/subsystems?departmentId=1
```

## การแก้ไขปัญหา

### หากรูปภาพไม่แสดง
1. ตรวจสอบ Console Log
2. ตรวจสอบ Network Tab
3. ทดสอบเข้าถึงไฟล์ SVG โดยตรง:
   ```
   http://localhost:3015/existing/images/production-planning.svg
   ```

### หาก API ไม่ทำงาน
- ระบบจะใช้ fallback ข้อมูลจาก hardcoded array
- รูปภาพจะใช้ path ตาม slug ของระบบ

### หากต้องการเปลี่ยนรูปภาพ
1. แทนที่ไฟล์ SVG ในโฟลเดอร์ `/frontend/public/existing/images/`
2. หรืออัปเดต `imageUrl` ในฐานข้อมูล

## ผลลัพธ์ที่คาดหวัง
- แต่ละระบบควรแสดงรูปภาพ SVG ที่สวยงาม
- ไม่ควรเห็นไอคอน ExternalLink อีกต่อไป
- Console ควรแสดง log การโหลดรูปภาพสำเร็จ
