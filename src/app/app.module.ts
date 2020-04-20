import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameService } from './quizz/game.service';
import { QuizComponent } from './quizz/quiz.component';
import { UiModule } from './ui.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    UiModule
  ],
  providers: [
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
