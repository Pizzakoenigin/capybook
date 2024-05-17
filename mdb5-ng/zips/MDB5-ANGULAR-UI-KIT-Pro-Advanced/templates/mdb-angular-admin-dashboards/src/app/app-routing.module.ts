import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsComponent } from './views/ads/ads.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { ChatComponent } from './views/chat/chat.component';
import { Ecommerce1Component } from './views/ecommerce1/ecommerce1.component';
import { Ecommerce2Component } from './views/ecommerce2/ecommerce2.component';
import { ErrorComponent } from './views/error/error.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { InvoiceComponent } from './views/invoice/invoice.component';
import { LoginRegisterComponent } from './views/login-register/login-register.component';
import { MailboxComponent } from './views/mailbox/mailbox.component';
import { OrderComponent } from './views/order/order.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SeoComponent } from './views/seo/seo.component';
import { TrafficComponent } from './views/traffic/traffic.component';
import { UserManagementComponent } from './views/user-management/user-management.component';

const routes: Routes = [
  { path: '', component: SeoComponent },
  { path: 'ecommerce-1', component: Ecommerce1Component },
  { path: 'ecommerce-2', component: Ecommerce2Component },
  { path: 'ads', component: AdsComponent },
  { path: 'order', component: OrderComponent },
  { path: 'traffic', component: TrafficComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'mailbox', component: MailboxComponent },
  { path: 'user-profile', component: ProfileComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'login-register', component: LoginRegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'error', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
