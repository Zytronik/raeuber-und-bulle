import { Component, OnDestroy } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnDestroy {

  private map!: L.Map;
  private watchId?: number;
  private userMarker?: L.Marker;
  private accuracyCircle?: L.Circle;

  protected readonly options: L.MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  onMapReady(map: L.Map): void {
    this.map = map;
    this.startTracking();
  }

  private startTracking(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const latLng = L.latLng(latitude, longitude);

        // init or update Marker
        if (!this.userMarker) {
          this.userMarker = L.marker(latLng)
            .addTo(this.map)
            .bindPopup('You are here');
          this.map.setView(latLng, 16);
        } else {
          this.userMarker.setLatLng(latLng);
        }

        // init or update Accuracy Circle
        if (!this.accuracyCircle) {
          this.accuracyCircle = L.circle(latLng, {
            radius: accuracy,
            color: 'blue',
            fillOpacity: 0.15
          }).addTo(this.map);
        } else {
          this.accuracyCircle
            .setLatLng(latLng)
            .setRadius(accuracy);
        }
      },
      error => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );
  }

  ngOnDestroy(): void {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}