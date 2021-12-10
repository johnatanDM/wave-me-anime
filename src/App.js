import './App.css';

function App() {

  const wave = () => {

  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Me manda um olá 🖐
        </div>

        <div className="bio">
          <p>Olá, sou o Baguete.</p>
          <p>Manda uma mensagem legal!</p>
          <p>💰 Você poderá ganhar algum ETH 💲</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Me conta ai
        </button>
      </div>
    </div>
  );
}

export default App;
