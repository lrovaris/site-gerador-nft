import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ContactPageComponent } from "./pages/contact-page/contact-page.component";
import { EnginePageComponent } from "./pages/engine-page/engine-page.component";

const routes: Routes = [

  { path: "", redirectTo:"home", pathMatch: "full" },
  { path: "home", component: HomePageComponent },
  { path: "engine", component: EnginePageComponent },
  { path: "**", component: ContactPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
