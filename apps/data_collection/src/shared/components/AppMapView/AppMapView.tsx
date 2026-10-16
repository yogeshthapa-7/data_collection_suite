import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import type { ReactNode } from 'react'

const DefaultIcon = L.icon({
  iconUrl: iconUrl as unknown as string,
  shadowUrl: iconShadow as unknown as string,
})

export interface MapMarker {
  position: [number, number]
  label?: string
}

interface AppMapViewProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  children?: ReactNode
}

const AppMapView = ({
  markers,
  center = [27.7172, 85.3142],
  zoom = 10,
  height = '560px',
  children,
}: AppMapViewProps) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} icon={DefaultIcon}>
          <Popup>{m.label || `Point ${i + 1}`}</Popup>
        </Marker>
      ))}
      {children}
    </MapContainer>
  )
}

export default AppMapView