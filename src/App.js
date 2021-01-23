import "./App.css";
import Menu from "./menu/Menu";
import GameRoom from "./gameRoom/GameRoom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="circle-background top"></div>
      <div className="circle-background bottom"></div>
      <Switch>
        <Route path="/gameroom/:roomid">
          <GameRoom />
        </Route>
        <Route path="/">
          <Menu />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
