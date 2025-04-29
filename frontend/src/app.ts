import { Router } from './core/router';
import { Component } from './core/Component';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TournamentGamePage } from './pages/TournamentGamePage';
import { LoginPage } from './pages/LoginPage';
import { LocalGamePage } from './pages/LocalGamePage';

export class App extends Component {
  setup() {
    if (this.$target) {
      const router = new Router(this.$target);
      router.addRoute("/", HomePage)
      .addRoute("/login", LoginPage)
      .addRoute("/tournament-game", TournamentGamePage)
      .addRoute("/local-game", LocalGamePage)
      .setNotFound(NotFoundPage)
      .start();

      if (!window.location.hash) {
        window.location.hash = "#/";
      } 
    } else {
      console.error("app: 먼가이상함")
    }
  }
  render() {
    //아무동작도 안하도록 설정
  }
}