import { Component } from '@angular/core';
import { SlideInterface } from '../interface';

@Component({
  selector: 'app-maincomp',
  templateUrl: './maincomp.component.html',
  styleUrls: ['./maincomp.component.css']
})
export class MaincompComponent {

  slides: SlideInterface[] = [
    { url: 'https://wallpapers.com/images/featured/motivational-quotes-ifmvdh16fo5ell2g.jpg', title: 'beach' },
    { url: 'https://wallpapercave.com/wp/wp7193396.jpg',title:'forset'},
    { url: 'https://i.pinimg.com/originals/2b/44/49/2b44490ac08621614e25aac7be884a19.jpg', title: 'forest' },
   
  ];

}
