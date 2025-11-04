import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default icon paths for Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
})

// Custom icons
const createCustomIcon = (color, iconHtml) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="transform: rotate(45deg); color: white; font-size: 16px; font-weight: bold;">${iconHtml}</div>
    </div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
}

const CUMILLA_CANTONMENT = {
  coords: [23.4583, 91.1820],
  name: 'কুমিল্লা ক্যান্টনমেন্ট',
  type: 'location'
}

const HOSPITALS = [
  { 
    id: 1, 
    name: 'কুমিল্লা মেডিকেল কলেজ হাসপাতাল', 
    coords: [23.4588, 91.1850], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০০',
    type: 'hospital'
  },
  { 
    id: 2, 
    name: 'কুমিল্লা সেনানিবাস হাসপাতাল', 
    coords: [23.4600, 91.1800], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১২০',
    type: 'hospital'
  },
  { 
    id: 3, 
    name: 'কুমিল্লা জেনারেল হাসপাতাল', 
    coords: [23.4550, 91.1880], 
    addr: 'কুমিল্লা', 
    phone: '০৮১-৬৭০০০',
    type: 'hospital'
  },
  { 
    id: 4, 
    name: 'কুমিল্লা সিটি হাসপাতাল', 
    coords: [23.4620, 91.1830], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১৫০',
    type: 'hospital'
  }
]

const PHARMACIES = [
  { 
    id: 1, 
    name: 'ক্যান্টনমেন্ট ফার্মেসি', 
    coords: [23.4590, 91.1810], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০১',
    type: 'pharmacy'
  },
  { 
    id: 2, 
    name: 'মেডিকেল ফার্মেসি', 
    coords: [23.4570, 91.1860], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০২',
    type: 'pharmacy'
  },
  { 
    id: 3, 
    name: 'সেনানিবাস ফার্মেসি', 
    coords: [23.4610, 91.1790], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৩',
    type: 'pharmacy'
  },
  { 
    id: 4, 
    name: 'ক্যান্টনমেন্ট মেডিকেল স্টোর', 
    coords: [23.4560, 91.1840], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৪',
    type: 'pharmacy'
  },
  { 
    id: 5, 
    name: 'ক্যান্টনমেন্ট সেন্টার ফার্মেসি', 
    coords: [23.4585, 91.1825], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৫',
    type: 'pharmacy'
  },
  { 
    id: 6, 
    name: 'আর্মি ফার্মেসি', 
    coords: [23.4595, 91.1805], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৬',
    type: 'pharmacy'
  },
  { 
    id: 7, 
    name: 'ক্যান্টনমেন্ট সাউথ ফার্মেসি', 
    coords: [23.4575, 91.1835], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৭',
    type: 'pharmacy'
  },
  { 
    id: 8, 
    name: 'মিলিটারি মেডিকেল স্টোর', 
    coords: [23.4605, 91.1815], 
    addr: 'কুমিল্লা ক্যান্টনমেন্ট', 
    phone: '০৮১-৬৭১০৮',
    type: 'pharmacy'
  }
]

export default function ClinicMap() {
  // Calculate center based on pharmacy locations (where most pharmacies are)
  const pharmacyCenter = [
    (PHARMACIES.reduce((sum, p) => sum + p.coords[0], 0) / PHARMACIES.length),
    (PHARMACIES.reduce((sum, p) => sum + p.coords[1], 0) / PHARMACIES.length)
  ]
  
  // Icon definitions
  const locationIcon = createCustomIcon('#2563eb', '📍')
  const hospitalIcon = createCustomIcon('#dc2626', '🏥')
  const pharmacyIcon = createCustomIcon('#16a34a', '💊')
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">নিকটস্থ ক্লিনিক</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span>ক্যান্টনমেন্ট</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>হাসপাতাল</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span>ফার্মেসি</span>
          </div>
        </div>
      </div>
      <div className="h-96 rounded-xl overflow-hidden border-2 border-blue-200">
        <MapContainer center={pharmacyCenter} zoom={16} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          
          {/* Cumilla Cantonment Location Pin */}
          <Marker position={CUMILLA_CANTONMENT.coords} icon={locationIcon}>
            <Popup>
              <div className="font-bangla">
                <p className="font-bold text-blue-600 text-lg">{CUMILLA_CANTONMENT.name}</p>
                <p className="text-sm text-gray-600">আপনার বর্তমান অবস্থান</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Hospitals */}
          {HOSPITALS.map(h => (
            <Marker key={h.id} position={h.coords} icon={hospitalIcon}>
              <Popup>
                <div className="font-bangla">
                  <p className="font-bold text-red-600">{h.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{h.addr}</p>
                  <p className="text-sm text-gray-700 mt-1">📞 {h.phone}</p>
                  <p className="text-xs text-gray-500 mt-2">হাসপাতাল</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Pharmacies */}
          {PHARMACIES.map(p => (
            <Marker key={p.id} position={p.coords} icon={pharmacyIcon}>
              <Popup>
                <div className="font-bangla">
                  <p className="font-bold text-green-600">{p.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{p.addr}</p>
                  <p className="text-sm text-gray-700 mt-1">📞 {p.phone}</p>
                  <p className="text-xs text-gray-500 mt-2">ফার্মেসি</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-bold text-red-600 mb-2">হাসপাতাল ({HOSPITALS.length}টি)</p>
          <p className="text-xs text-gray-600">কুমিল্লা ক্যান্টনমেন্টের নিকটস্থ হাসপাতালগুলো দেখানো হয়েছে</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="font-bold text-green-600 mb-2">ফার্মেসি ({PHARMACIES.length}টি)</p>
          <p className="text-xs text-gray-600">কুমিল্লা ক্যান্টনমেন্টের নিকটস্থ ফার্মেসিগুলো দেখানো হয়েছে</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">ডেটা: OpenStreetMap | কুমিল্লা ক্যান্টনমেন্ট এলাকা</p>
    </div>
  )
}


