"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import type React from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  UtensilsCrossed,
  Users,
  Calculator,
  Building2,
  Monitor,
  Factory,
  ExternalLink,
  Home,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Interface for subsystem data from API
interface Subsystem {
  id: number
  name: string
  slug: string
  url: string
  imageUrl?: string
  sortOrder: number
  department: {
    id: number
    nameTh: string
    nameEn: string
  }
}

// Interface for department data from API
interface Department {
  id: number
  nameTh: string
  nameEn: string
  iconName: string
  gradientClass: string
  sortOrder: number
  isActive: boolean
  subsystems?: Subsystem[]
}

// Interface for announcement data from API
interface Announcement {
  id: number
  title: string
  content: string
  type: 'meeting' | 'system' | 'note'
  isPublic: boolean
  visibleFrom?: string
  visibleTo?: string
  createdAt: string
  updatedAt: string
  creator?: {
    id: number
    email: string
    fullName: string
  }
}

// Interface for event data from API
interface Event {
  id: number
  title: string
  description?: string
  startAt: string
  endAt: string
  allDay: boolean
  createdAt: string
  updatedAt: string
  creator?: {
    id: number
    email: string
    fullName: string
  }
}

const departments = [
  {
    name: "ระบบจัดการผลิต",
    count: 4,
    id: "production",
    icon: Factory,
    gradient: "bg-gradient-to-br from-amber-400 to-orange-600",
  },
  { name: "ระบบงาน HR", count: 0, id: "hr", icon: Users, gradient: "bg-gradient-to-br from-blue-400 to-indigo-600" },
  {
    name: "ระบบงานบัญชี",
    count: 0,
    id: "accounting",
    icon: Calculator,
    gradient: "bg-gradient-to-br from-purple-400 to-pink-500",
  },
  {
    name: "ระบบงานเทคโนโลยีสารสนเทศ (IT)",
    count: 0,
    id: "it",
    icon: Monitor,
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-600",
  },
  {
    name: "ระบบงานอาคาร",
    count: 0,
    id: "building",
    icon: Building2,
    gradient: "bg-gradient-to-br from-emerald-400 to-teal-600",
  },
  {
    name: "ระบบงาน RD",
    count: 0,
    id: "rd",
    icon: UtensilsCrossed,
    gradient: "bg-gradient-to-br from-orange-400 to-red-500",
  },
]

const productionSubsystems = [
  {
    name: "ระบบจัดการแผนการผลิต",
    url: "http://192.168.0.94:3012/",
    id: "production-planning",
    gradient: "bg-gradient-to-br from-yellow-200 to-yellow-300",
  },
  {
    name: "ระบบจัดการกระบวนการผลิต",
    url: "http://192.168.0.93/tracker/index.html",
    id: "production-process",
    gradient: "bg-gradient-to-br from-yellow-200 to-yellow-300",
  },
  {
    name: "ระบบจับเวลาการผลิต",
    url: "http://192.168.0.94:3012/tracker",
    id: "production-timing",
    gradient: "bg-gradient-to-br from-yellow-200 to-yellow-300",
  },
  {
    name: "ตารางงานการผลิตสินค้าครัวกลาง",
    url: "http://192.168.0.94:3013/",
    id: "kitchen-schedule",
    gradient: "bg-gradient-to-br from-yellow-200 to-yellow-300",
  },
]

const quickNotes = [
  {
    id: "1",
    title: "ประชุมทีมพัฒนา",
    content: "ประชุมทบทวนโปรเจคใหม่ วันพุธ 14:00 น.",
    timestamp: "2 ชั่วโมงที่แล้ว",
    type: "meeting",
  },
  {
    id: "2",
    title: "อัพเดทระบบ",
    content: "ระบบจะปิดปรับปรุงวันเสาร์ 02:00-06:00 น.",
    timestamp: "1 วันที่แล้ว",
    type: "system",
  },
  {
    id: "3",
    title: "ทดสอบระบบ",
    content: "ทดสอบการใช้งานระบบการจัดการแผนผลิตวันที่ 22 สิงหาคม เวลา 17:00-19:00 น.",
    timestamp: "เพิ่งเพิ่ม",
    type: "system",
  },
]

export default function IntranetDashboard() {
  const [currentView, setCurrentView] = useState<"main" | "production">("main")
  const [activeNav, setActiveNav] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [departmentsList, setDepartmentsList] = useState(departments)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [notes, setNotes] = useState(quickNotes)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [announcementsCollapsed, setAnnouncementsCollapsed] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [subsystems, setSubsystems] = useState<Subsystem[]>([])
  const [loadingSubsystems, setLoadingSubsystems] = useState(false)
  const [departmentsData, setDepartmentsData] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)

  // Upload states
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedSubsystem, setSelectedSubsystem] = useState<Subsystem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  // Removed isClient state to fix hydration mismatch

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())

  const currentDate = new Date()
  const today = currentDate.getDate()
  const todayMonth = currentDate.getMonth()
  const todayYear = currentDate.getFullYear()

  // Fetch departments from API
  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const response = await fetch('http://192.168.0.96:3105/api/v1/dashboard/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartmentsData(data.data.departments || [])
      } else {
        console.error('Failed to fetch departments from database')
        setDepartmentsData([])
      }
    } catch (error) {
      console.error('Error fetching departments from database:', error)
      setDepartmentsData([])
    } finally {
      setLoadingDepartments(false)
    }
  }

  // Fetch subsystems from API
  const fetchSubsystems = async () => {
    setLoadingSubsystems(true)
    console.log('🚀 Fetching subsystems from API...')
    try {
      const response = await fetch('http://192.168.0.96:3105/api/v1/dashboard/subsystems?departmentId=1') // Production department
      console.log('📡 API Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API Data received:', data)
        setSubsystems(data.data.subsystems || [])
      } else {
        console.error('❌ Failed to fetch subsystems from database')
        setSubsystems([])
      }
    } catch (error) {
      console.error('Error fetching subsystems from database:', error)
      setSubsystems([])
    } finally {
      setLoadingSubsystems(false)
    }
  }

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      console.log('🚀 Fetching announcements from API...')
      const response = await fetch('http://192.168.0.96:3105/api/v1/dashboard/announcements')
      console.log('📡 API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Announcements loaded from database:', data.data.announcements)
        setAnnouncements(data.data.announcements || [])
      } else {
        console.error('❌ Failed to fetch announcements from database, status:', response.status)
        setAnnouncements([])
      }
    } catch (error) {
      console.error('❌ Error fetching announcements from database:', error)
      setAnnouncements([])
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  // Fetch events from API
  const fetchEvents = async () => {
    setLoadingEvents(true)
    try {
      const response = await fetch('http://192.168.0.96:3105/api/v1/dashboard/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.data.events || [])
      } else {
        console.error('Failed to fetch events from database')
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events from database:', error)
      setEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  // Upload image function
  const handleImageUpload = async (file: File) => {
    if (!selectedSubsystem) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`http://192.168.0.96:3105/api/v1/upload/subsystem/${selectedSubsystem.id}`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Upload successful:', result)
        
        // Update the subsystem image in state with full backend URL
        setSubsystems(prev => prev.map(sub => 
          sub.id === selectedSubsystem.id 
            ? { ...sub, imageUrl: `http://192.168.0.96:3105${result.data.imageUrl}` }
            : sub
        ))
        
        // Close modal
        setShowUploadModal(false)
        setSelectedSubsystem(null)
        
        // Show success message
        alert('อัปโหลดรูปภาพสำเร็จ!')
      } else {
        let errorMessage = 'อัปโหลดรูปภาพไม่สำเร็จ'
        try {
          const error = await response.json()
          console.error('❌ Upload failed:', error)
          errorMessage = error.message || errorMessage
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        alert(errorMessage)
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
        return
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }
      
      handleImageUpload(file)
    }
  }

  // Open upload modal
  const openUploadModal = (subsystem: Subsystem) => {
    setSelectedSubsystem(subsystem)
    setShowUploadModal(true)
  }

  // Load all data on component mount
  useEffect(() => {
    console.log('🔄 Loading all data on component mount...')
    fetchDepartments()
    fetchSubsystems()
    fetchAnnouncements()
    fetchEvents()
  }, [])

  // Debug: Log subsystems data
  useEffect(() => {
    if (subsystems.length > 0) {
      console.log('🎯 Subsystems loaded from API:', subsystems)
      subsystems.forEach(sub => {
        console.log(`📋 System: ${sub.name}`)
        console.log(`🔗 URL: ${sub.url}`)
        console.log(`🖼️ Image: ${sub.imageUrl}`)
        console.log('---')
      })
    } else {
      console.log('⚠️ No subsystems loaded yet')
    }
  }, [subsystems])

  // Debug: Log announcements data
  useEffect(() => {
    console.log('📢 Announcements state changed:', announcements)
    console.log('📢 Loading state:', loadingAnnouncements)
  }, [announcements, loadingAnnouncements])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ]

  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear)
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear)

  const handlePreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  // Resolve subsystem image source: prefer DB imageUrl, else fallback to existing assets by slug
  const getSubsystemImageSrc = (subsystem: Subsystem): string => {
    const dbUrl = subsystem.imageUrl
    if (!dbUrl || dbUrl.trim().length === 0) return ''
    // Use backend 3105 for relative paths
    const normalized = dbUrl.startsWith('/') ? dbUrl : `/${dbUrl}`
    const full = dbUrl.startsWith('http') ? dbUrl : `http://192.168.0.96:3105${normalized}`
    return full
  }

  const handleDepartmentClick = (deptId: string) => {
    if (deptId === "production") {
      setCurrentView("production")
    }
  }

  const handleBackClick = () => {
    setCurrentView("main")
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const response = await fetch('http://192.168.0.96:3105/api/v1/dashboard/announcements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: "โน้ตใหม่",
            content: newNote.trim(),
            type: "note"
          })
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Announcement created:', result)
          // Refresh announcements from database
          fetchAnnouncements()
          setNewNote("")
          setShowAddNote(false)
        } else {
          console.error('❌ Failed to create announcement')
          alert('ไม่สามารถเพิ่มประกาศได้')
        }
      } catch (error) {
        console.error('❌ Error creating announcement:', error)
        alert('เกิดข้อผิดพลาดในการเพิ่มประกาศ')
      }
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNote(noteId)
    setEditText(content)
  }

  const handleSaveEdit = (noteId: string) => {
    if (editText.trim()) {
      setNotes(
        notes.map((note) => (note.id === noteId ? { ...note, content: editText.trim(), timestamp: "เพิ่งแก้ไข" } : note)),
      )
    }
    setEditingNote(null)
    setEditText("")
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditText("")
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newDepartments = [...departmentsList]
    const draggedItem = newDepartments[draggedIndex]

    // Remove dragged item
    newDepartments.splice(draggedIndex, 1)

    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newDepartments.splice(insertIndex, 0, draggedItem)

    setDepartmentsList(newDepartments)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Subsystem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const [selectedSearchSubsystem, setSelectedSearchSubsystem] = useState<Subsystem | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [activeResults, setActiveResults] = useState<Subsystem[]>([])

  const normalize = (text: string) => text.toLowerCase().trim()

  const updateSuggestions = (query: string) => {
    const q = normalize(query)
    if (!q) {
      setSearchResults([])
      setShowSuggestions(false)
      setHighlightIndex(-1)
      return
    }
    const results = subsystems
      .filter((s) => normalize(s.name).includes(q) || normalize(s.slug).includes(q))
      .slice(0, 8)
    setSearchResults(results)
    setShowSuggestions(results.length > 0)
    setHighlightIndex(results.length > 0 ? 0 : -1)
  }

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (!q) return
    // Show full results list based on current query
    const results = subsystems
      .filter((s) => normalize(s.name).includes(normalize(q)) || normalize(s.slug).includes(normalize(q)))
    setActiveResults(results)
    setShowSearchResults(true)
    setSelectedSearchSubsystem(null)
    setShowSuggestions(false)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((prev) => (searchResults.length === 0 ? -1 : (prev + 1) % searchResults.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((prev) => (searchResults.length === 0 ? -1 : (prev - 1 + searchResults.length) % searchResults.length))
    } else if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (item: Subsystem) => {
    setSelectedSearchSubsystem(item)
    setSearchQuery(item.name)
    setShowSuggestions(false)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-64"} fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transform ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:flex-shrink-0 text-white flex flex-col`}
        style={{ background: `linear-gradient(to bottom, #292F59, #292F59, #292F59)` }}
      >
        {/* Logo/Brand */}
        <div className="p-4 lg:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex-1">
                <h1 className="text-lg lg:text-xl font-bold text-white">ระบบจัดการองค์กร</h1>
                <p className="text-xs text-white/70 mt-0.5">JITDHANA WEB PORTAL</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-white hover:bg-white/10 hover:text-white p-2 hidden lg:flex"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(false)}
              className="text-white hover:bg-white/10 hover:text-white p-2 lg:hidden"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 lg:p-4">
          <div className="space-y-2">
            <Button
              variant={activeNav === "dashboard" ? "secondary" : "ghost"}
              className={`w-full ${sidebarCollapsed ? "justify-center px-2" : "justify-start"} text-white hover:bg-white/10 hover:text-white ${activeNav === "dashboard" ? "bg-white/20 text-white" : ""} h-10 lg:h-auto`}
              onClick={() => {
                setActiveNav("dashboard")
                setCurrentView("main")
                setMobileSidebarOpen(false)
              }}
              title={sidebarCollapsed ? "หน้าแรก" : ""}
            >
              <Home className={`w-5 h-5 lg:w-4 lg:h-4 ${sidebarCollapsed ? "" : "mr-3"}`} strokeWidth={1.5} />
              {!sidebarCollapsed && "หน้าแรก"}
            </Button>
            <Button
              variant={activeNav === "feed" ? "secondary" : "ghost"}
              className={`w-full ${sidebarCollapsed ? "justify-center px-2" : "justify-start"} text-white hover:bg-white/10 hover:text-white ${activeNav === "feed" ? "bg-white/20 text-white" : ""} h-10 lg:h-auto hidden`}
              onClick={() => {
                setActiveNav("feed")
                setMobileSidebarOpen(false)
              }}
              title={sidebarCollapsed ? "ข่าวสาร" : ""}
            >
              <Bell className={`w-5 h-5 lg:w-4 lg:h-4 ${sidebarCollapsed ? "" : "mr-3"}`} strokeWidth={1.5} />
              {!sidebarCollapsed && "ข่าวสาร"}
            </Button>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 lg:p-4 border-t border-white/10 hidden">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3 lg:mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {currentView === "main" && (
          <div className="relative h-48 lg:h-64 overflow-hidden">
            {/* Building Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url('/existing/images/jitdhana-building.jpg')",
                backgroundPosition: "10% 35%",
              }}
            />

            {/* Diagonal Overlay */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/30 to-transparent transform skew-x-12 origin-top-right" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold mb-2">บริษัท จิตต์ธนา จำกัด</h1>
                <p className="text-sm lg:text-lg opacity-90">ระบบจัดการองค์กร</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="absolute top-4 left-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(true)}
                style={{ backgroundColor: "#292F59" }}
                className="p-3 hover:opacity-90 rounded-lg border border-white/20 shadow-sm"
              >
                <ChevronRight className="w-6 h-6 text-white" strokeWidth={2} />
              </Button>
            </div>

            {/* Search Section */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4"
                  strokeWidth={1.5}
                />
                <div className="relative">
                  <Input
                    placeholder="พิมพ์ค้นหาชื่อระบบ"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      updateSuggestions(e.target.value)
                    }}
                    onFocus={() => updateSuggestions(searchQuery)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-10 w-48 lg:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
                  />
                  {showSuggestions && (
                    <div className="absolute mt-1 left-0 right-0 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 max-h-64 overflow-auto">
                      {searchResults.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSuggestion(item)}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${idx === highlightIndex ? 'bg-gray-100' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{item.name}</span>
                            <span className="text-xs text-gray-500 truncate">{item.slug}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleSearch}
                className="hover:opacity-90 text-white px-3 lg:px-4 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                size="sm"
              >
                <Search className="w-4 h-4 mr-0 lg:mr-2" strokeWidth={1.5} />
                <span className="hidden lg:inline">ค้นหา</span>
              </Button>
            </div>
          </div>
        )}

        {/* Top Header - Only show when not in main view or on mobile */}
        {currentView !== "main" && (
          <header className="bg-background border-b border-border p-4 lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSidebarOpen(true)}
                  style={{ backgroundColor: "#292F59" }}
                  className="lg:hidden p-3 hover:opacity-90 rounded-lg border border-gray-200 shadow-sm"
                >
                  <ChevronRight className="w-6 h-6 text-white" strokeWidth={2} />
                </Button>

                <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <img
                      src="/existing/images/jitdhana-logo.png"
                      alt="JITDHANA Co.,LTD"
                      className="h-8 sm:h-12 lg:h-16 w-auto"
                    />
                  </div>
                  <div className="text-center lg:text-left">
                    <h2 className="text-lg lg:text-2xl font-bold text-foreground truncate">บริษัท จิตต์ธนา จำกัด</h2>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                    strokeWidth={1.5}
                  />
                  <div className="relative">
                    <Input
                      placeholder="พิมพ์ค้นหาชื่อระบบ"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        updateSuggestions(e.target.value)
                      }}
                      onFocus={() => updateSuggestions(searchQuery)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onKeyDown={handleSearchKeyDown}
                      className="pl-10 w-48 lg:w-64 bg-input border-border"
                    />
                    {showSuggestions && (
                      <div className="absolute mt-1 left-0 right-0 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 max-h-64 overflow-auto">
                        {searchResults.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectSuggestion(item)}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${idx === highlightIndex ? 'bg-gray-100' : ''}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium truncate">{item.name}</span>
                              <span className="text-xs text-gray-500 truncate">{item.slug}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  className="hover:opacity-90 text-primary-foreground px-3 lg:px-4 text-sm bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-0 lg:mr-2" strokeWidth={1.5} />
                  <span className="hidden lg:inline">ค้นหา</span>
                </Button>
              </div>
            </div>
            <div className="mt-4 md:hidden">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                  strokeWidth={1.5}
                />
                <div className="relative">
                  <Input
                    placeholder="พิมพ์ค้นหาชื่อระบบ"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      updateSuggestions(e.target.value)
                    }}
                    onFocus={() => updateSuggestions(searchQuery)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-10 w-full bg-input border-border"
                  />
                  {showSuggestions && (
                    <div className="absolute mt-1 left-0 right-0 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 max-h-64 overflow-auto">
                      {searchResults.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSuggestion(item)}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${idx === highlightIndex ? 'bg-gray-100' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{item.name}</span>
                            <span className="text-xs text-gray-500 truncate">{item.slug}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Mobile Search Bar - Only show in main view */}
        {currentView === "main" && (
          <div className="md:hidden p-4 bg-background border-b border-border">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                strokeWidth={1.5}
              />
              <div className="relative">
                <Input
                  placeholder="พิมพ์ค้นหาชื่อระบบ"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    updateSuggestions(e.target.value)
                  }}
                  onFocus={() => updateSuggestions(searchQuery)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10 w-full bg-input border-border"
                />
                {showSuggestions && (
                  <div className="absolute mt-1 left-0 right-0 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 z-50 max-h-64 overflow-auto">
                    {searchResults.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectSuggestion(item)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${idx === highlightIndex ? 'bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">{item.name}</span>
                          <span className="text-xs text-gray-500 truncate">{item.slug}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area with Right Sidebar */}
        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          {/* Main Content - Service Systems Priority on Mobile */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto order-1">
            {selectedSearchSubsystem && (
              <div className="mb-3 lg:mb-4">
                <Card
                  className="group hover:shadow-md transition-all duration-300 border border-gray-200 bg-white text-gray-800 cursor-pointer"
                  onClick={() => window.open(selectedSearchSubsystem.url, "_blank")}
                >
                  <div className="p-3 lg:p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                        {getSubsystemImageSrc(selectedSearchSubsystem) ? (
                          <img
                            src={getSubsystemImageSrc(selectedSearchSubsystem)}
                            alt={selectedSearchSubsystem.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm text-gray-800 leading-tight truncate">
                          {selectedSearchSubsystem.name}
                        </h3>
                        <div className="text-[11px] text-gray-600 truncate">
                          {selectedSearchSubsystem.url}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                          slug: {selectedSearchSubsystem.slug}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {showSearchResults && (
              <div className="mb-4 lg:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-700">
                    ผลการค้นหา "{searchQuery}" ({activeResults.length} รายการ)
                  </div>
                  <button
                    onClick={() => { setShowSearchResults(false); setActiveResults([]) }}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    ล้างผลการค้นหา
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeResults.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-md transition-all duration-300 border border-gray-200 bg-white text-gray-800 cursor-pointer"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                            {getSubsystemImageSrc(item) ? (
                              <img
                                src={getSubsystemImageSrc(item)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-gray-800 truncate">{item.name}</div>
                            <div className="text-[11px] text-gray-600 truncate">{item.url}</div>
                            <div className="text-[10px] text-gray-500 truncate">slug: {item.slug}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentView === "production" ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4 lg:mb-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackClick}
                      style={{ backgroundColor: "#292F59" }}
                      className="text-white hover:opacity-90 text-xs lg:text-sm px-2 lg:px-4"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1 lg:mr-2 text-white" strokeWidth={1.5} />
                      <span className="hidden sm:inline text-white">Back</span>
                    </Button>
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">ระบบจัดการผลิต</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
                  {loadingSubsystems ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, index) => (
                      <Card key={index} className="border border-gray-200 bg-white overflow-hidden">
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : subsystems.length > 0 ? (
                    subsystems.map((subsystem) => (
                      <Card
                        key={subsystem.id}
                        className="group hover:shadow-lg transition-all duration-700 ease-in-out border border-gray-200 bg-white hover:bg-gradient-to-br hover:from-yellow-200 hover:to-yellow-300 text-gray-800 overflow-hidden px-0 py-0 touch-manipulation relative cursor-pointer"
                        onClick={() => window.open(subsystem.url, "_blank")}
                      >
                        <div className="p-0">
                          <div className="relative w-full aspect-video bg-gray-100 border-b border-gray-200 overflow-hidden">
                            {getSubsystemImageSrc(subsystem) ? (
                              <img
                                src={getSubsystemImageSrc(subsystem)}
                                alt={subsystem.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  // Hide image if it fails, keep neutral background
                                  target.style.display = 'none'
                                }}
                              />
                            ) : null}
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openUploadModal(subsystem)
                                }}
                                className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow border"
                                title="อัปโหลดรูปภาพ"
                              >
                                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="p-4 lg:p-5">
                            <h3 className="font-medium text-sm lg:text-base text-gray-800 mb-1.5 leading-tight break-words">
                              {subsystem.name}
                            </h3>
                            <div className="text-xs lg:text-sm text-gray-600 break-all">
                              <span className="block truncate">{subsystem.url}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    // Empty state - show upload cards for each system
                    productionSubsystems.map((sub, index) => (
                      <Card
                        key={`empty-${index}`}
                        className="group hover:shadow-lg transition-all duration-700 ease-in-out border border-gray-200 bg-white hover:bg-gradient-to-br hover:from-yellow-200 hover:to-yellow-300 text-gray-800 overflow-hidden px-0 py-0 touch-manipulation relative"
                      >
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full p-0.5 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm lg:text-base text-gray-800 mb-2 leading-tight break-words">
                                {sub.name}
                              </h3>
                              <div className="text-xs lg:text-sm text-gray-600 break-all">
                                <span className="block truncate">{sub.url}</span>
                              </div>
                            </div>
                            
                            {/* Upload button */}
                            <div className="relative">
                              <button
                                onClick={() => {
                                  // Create a temporary subsystem object for upload
                                  const tempSubsystem = {
                                    id: index + 1,
                                    name: sub.name,
                                    slug: sub.id,
                                    url: sub.url,
                                    imageUrl: undefined,
                                    sortOrder: index + 1,
                                    department: {
                                      id: 1,
                                      nameTh: 'ระบบจัดการผลิต',
                                      nameEn: 'Production Management'
                                    }
                                  };
                                  openUploadModal(tempSubsystem);
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                title="อัปโหลดรูปภาพ"
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 lg:space-y-8">
                {/* Services Grid - Enhanced Mobile Priority */}
                <div>
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <h3 className="font-semibold text-card-foreground text-lg">ระบบงานบริการ</h3>
                  </div>

                  <div className="max-w-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                      {departmentsList.map((dept, index) => {
                        const IconComponent = dept.icon
                        const isDragging = draggedIndex === index
                        const isDragOver = dragOverIndex === index

                        let hoverGradientClass = ""
                        let iconBgClass = ""
                        let borderClass = ""
                        switch (dept.id) {
                          case "production":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-amber-400 hover:to-orange-600"
                            iconBgClass = "bg-gradient-to-br from-amber-200 to-orange-300 group-hover:bg-white/20"
                            borderClass = "border-amber-300"
                            break
                          case "hr":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-600"
                            iconBgClass = "bg-gradient-to-br from-blue-200 to-indigo-300 group-hover:bg-white/20"
                            borderClass = "border-blue-300"
                            break
                          case "accounting":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-purple-400 hover:to-pink-500"
                            iconBgClass = "bg-gradient-to-br from-purple-200 to-pink-300 group-hover:bg-white/20"
                            borderClass = "border-purple-300"
                            break
                          case "it":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-600"
                            iconBgClass = "bg-gradient-to-br from-cyan-200 to-blue-300 group-hover:bg-white/20"
                            borderClass = "border-cyan-300"
                            break
                          case "building":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-emerald-400 hover:to-teal-600"
                            iconBgClass = "bg-gradient-to-br from-emerald-200 to-teal-300 group-hover:bg-white/20"
                            borderClass = "border-emerald-300"
                            break
                          case "rd":
                            hoverGradientClass = "hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500"
                            iconBgClass = "bg-gradient-to-br from-orange-200 to-red-300 group-hover:bg-white/20"
                            borderClass = "border-orange-300"
                            break
                        }

                        return (
                          <Card
                            key={dept.id}
                            className={`group hover:shadow-lg hover:shadow-black/25 hover:brightness-110 transition-all duration-500 ease-in-out cursor-pointer overflow-hidden border ${borderClass} shadow-none py-0.5 bg-white ${hoverGradientClass} text-gray-800 hover:text-white touch-manipulation ${
                              isDragging ? "opacity-50 scale-95" : ""
                            } ${isDragOver ? "ring-2 ring-primary ring-offset-2" : ""} w-full`}
                            onClick={() => handleDepartmentClick(dept.id)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="p-3 sm:p-4 lg:p-6 text-white relative overflow-hidden h-full min-h-[90px] sm:min-h-[100px] lg:min-h-[120px] flex items-center w-auto">
                              <div className="relative z-10 flex items-center gap-3 lg:gap-4 w-full">
                                <div
                                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${iconBgClass} backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-in-out`}
                                >
                                  <IconComponent
                                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 transition-colors duration-500 ease-in-out"
                                    strokeWidth={1.5}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-tight mb-1 text-gray-800 group-hover:text-white transition-colors duration-500 ease-in-out">
                                    {dept.name}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-500 ease-in-out">
                                    {dept.count} ระบบ
                                  </p>
                                </div>
                                <ChevronRight
                                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-white/80 transition-colors duration-500 ease-in-out flex-shrink-0"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="xl:hidden">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className="font-semibold text-green-600 text-base lg:text-lg">ประกาศ</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs p-2 lg:p-1 text-secondary-foreground hover:opacity-90 h-8 lg:h-auto bg-secondary hover:bg-secondary/80"
                        onClick={() => setAnnouncementsCollapsed(!announcementsCollapsed)}
                        title={announcementsCollapsed ? "ขยาย" : "ยุบ"}
                      >
                        {announcementsCollapsed ? (
                          <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                        ) : (
                          <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 lg:h-auto px-2 lg:px-3 text-accent-foreground hover:opacity-90 bg-accent hover:bg-accent/80 py-1"
                        onClick={() => setShowAddNote(!showAddNote)}
                      >
                        <Plus className="w-3 h-3 mr-1" strokeWidth={1.5} />
                        เพิ่ม
                      </Button>
                    </div>
                  </div>

                  {!announcementsCollapsed && (
                    <div className="space-y-3 mb-6">
                      {showAddNote && (
                        <Card className="p-3 mb-3 border-primary/20">
                          <Textarea
                            placeholder="เพิ่มโน้ตด่วน..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="mb-2 min-h-[60px] resize-none text-sm lg:text-base"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddNote} className="flex-1 h-8 lg:h-auto text-sm">
                              บันทึก
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowAddNote(false)}
                              className="h-8 lg:h-auto text-sm"
                            >
                              ยกเลิก
                            </Button>
                          </div>
                        </Card>
                      )}

                      {loadingAnnouncements ? (
                        <div className="text-center py-4">
                          <div className="text-sm text-gray-500">กำลังโหลดประกาศ...</div>
                        </div>
                      ) : announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                          <div
                            key={announcement.id}
                            className="relative transform transition-all duration-200 hover:scale-[1.02] group"
                          >
                            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all bg-white rounded-none border-0 py-0 relative overflow-hidden touch-manipulation">
                              <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 transform rotate-45 translate-x-2 -translate-y-2 shadow-sm"></div>
                              <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-gray-100"></div>

                              <div className="p-3 lg:p-4 relative">
                                <div className="pr-12 lg:pr-16">
                                  <div className="flex items-start gap-3">
                                    <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"></div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-gray-900 mb-2">{announcement.title}</h4>
                                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{announcement.content}</p>
                                      <span className="text-xs text-gray-500">
                                        {new Date(announcement.createdAt).toLocaleString('th-TH')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <div className="text-sm text-gray-500">ไม่มีประกาศ</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="xl:hidden">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className="font-semibold text-green-600 text-base lg:text-lg">
                      {monthNames[calendarMonth]} {calendarYear + 543}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-secondary-foreground hover:opacity-90 bg-secondary hover:bg-secondary/80"
                        onClick={handlePreviousMonth}
                      >
                        <ChevronLeft className="w-3 h-3" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-secondary-foreground hover:opacity-90 bg-secondary hover:bg-secondary/80"
                        onClick={handleNextMonth}
                      >
                        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                  <Card className="p-3 lg:p-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }, (_, i) => (
                          <div key={`empty-${i}`} className="p-1"></div>
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const day = i + 1
                          const isToday = day === today && calendarMonth === todayMonth && calendarYear === todayYear
                          return (
                            <div
                              key={day}
                              className={`text-center text-xs p-2 rounded transition-colors cursor-pointer hover:bg-muted ${
                                isToday
                                  ? "bg-green-600 text-white font-semibold"
                                  : "text-card-foreground hover:text-foreground"
                              }`}
                            >
                              {day}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - Hidden on Mobile, Visible on Desktop */}
          <aside className="hidden xl:block w-80 border-l border-border p-6 overflow-auto bg-slate-50 order-2">
            <div className="space-y-6">
              {/* Quick Note */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-600 text-lg">ประกาศ</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs p-1 text-secondary-foreground hover:opacity-90 bg-secondary hover:bg-secondary/80"
                      onClick={() => setAnnouncementsCollapsed(!announcementsCollapsed)}
                      title={announcementsCollapsed ? "ขยาย" : "ยุบ"}
                    >
                      {announcementsCollapsed ? (
                        <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 text-accent-foreground hover:opacity-90 bg-accent hover:bg-accent/80"
                      onClick={() => setShowAddNote(!showAddNote)}
                    >
                      <Plus className="w-3 h-3 mr-1" strokeWidth={1.5} />
                      เพิ่ม
                    </Button>
                  </div>
                </div>

                {!announcementsCollapsed && (
                  <div className="space-y-3 mb-6">
                    {showAddNote && (
                      <Card className="p-3 mb-3 border-primary/20">
                        <Textarea
                          placeholder="เพิ่มโน้ตด่วน..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="mb-2 min-h-[60px] resize-none text-sm lg:text-base"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddNote} className="flex-1 h-8 lg:h-auto text-sm">
                            บันทึก
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddNote(false)}
                            className="h-8 lg:h-auto text-sm"
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      </Card>
                    )}

                    {loadingAnnouncements ? (
                      <div className="text-center py-4">
                        <div className="text-sm text-gray-500">กำลังโหลดประกาศ...</div>
                      </div>
                    ) : announcements.length > 0 ? (
                      announcements.map((announcement, index) => (
                        <div
                          key={announcement.id}
                          className="relative transform transition-all duration-200 hover:scale-[1.02] group"
                        >
                          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all bg-white rounded-none border-0 py-0 relative overflow-hidden touch-manipulation">
                            <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 transform rotate-45 translate-x-2 -translate-y-2 shadow-sm"></div>
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-gray-100"></div>

                            <div className="p-3 lg:p-4 relative">
                              <div className="pr-12 lg:pr-16">
                                <div className="flex items-start gap-3">
                                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"></div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">{announcement.title}</h4>
                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{announcement.content}</p>
                                    <span className="text-xs text-gray-500">
                                      {new Date(announcement.createdAt).toLocaleString('th-TH')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-sm text-gray-500">ไม่มีประกาศ</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar Widget */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-600 text-lg">
                      {monthNames[calendarMonth]} {calendarYear + 543}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-secondary-foreground hover:opacity-90 bg-secondary hover:bg-secondary/80"
                        onClick={handlePreviousMonth}
                      >
                        <ChevronLeft className="w-3 h-3" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-secondary-foreground hover:opacity-90 bg-secondary hover:bg-secondary/80"
                        onClick={handleNextMonth}
                      >
                        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }, (_, i) => (
                          <div key={`empty-${i}`} className="p-1"></div>
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const day = i + 1
                          const isToday = day === today && calendarMonth === todayMonth && calendarYear === todayYear
                          return (
                            <div
                              key={day}
                              className={`text-center text-xs p-2 rounded transition-colors cursor-pointer hover:bg-muted ${
                                isToday
                                  ? "bg-green-600 text-white font-semibold"
                                  : "text-card-foreground hover:text-foreground"
                              }`}
                            >
                              {day}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Upload Image Modal */}
      {showUploadModal && selectedSubsystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                อัปโหลดรูปภาพ
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedSubsystem(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                ระบบ: <span className="font-medium">{selectedSubsystem.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                รองรับไฟล์: JPG, PNG, GIF, SVG, WebP (ขนาดไม่เกิน 5MB)
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">
                    {uploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกไฟล์รูปภาพ'}
                  </p>
                  <p className="text-xs text-gray-500">
                    หรือลากไฟล์มาวางที่นี่
                  </p>
                </div>
              </label>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  กำลังอัปโหลด... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedSubsystem(null)
                }}
                disabled={uploading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
