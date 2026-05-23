import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LogIn, Phone } from 'lucide-angular';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './welcome.html',
})
export class Welcome {
  protected readonly icons = {
    login: LogIn,
    phone: Phone,
  };
}
