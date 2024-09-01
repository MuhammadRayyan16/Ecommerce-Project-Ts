import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import React, { useEffect, useRef, useState } from 'react'

const defaultLocation = { lat: 45.516, lng: -73.56 }

function MyComponent({
  setShippingLocation,
}: {
  // eslint-disable-next-line no-unused-vars
  setShippingLocation: ({ lat, lng }: { lat: number; lng: number }) => void
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const markerRef = useRef(null)

  const onIdle = () => {
    if (map) {
      const lat = (map as any).center.lat()
      const lng = (map as any).center.lng()
      setLocation({
        lat,
        lng,
      })
      setShippingLocation({ lat, lng })
    }
  }

  const [center, setCenter] = useState(defaultLocation)
  const [location, setLocation] = useState(center)
  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map: any) {
    setMap(map)
  }, [])

  const onMarkerLoad = (marker: any) => {
    markerRef.current = marker
  }

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '400px',
      }}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={onIdle}
    >
      <Marker position={location} onLoad={onMarkerLoad}></Marker>
    </GoogleMap>
  ) : (
    <></>
  )
}
const ShippingAddressMap = React.memo(MyComponent)
export default ShippingAddressMap
