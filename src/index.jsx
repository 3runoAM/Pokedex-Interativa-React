import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/*
     <App> é o componente raiz que gerencia as rotas da aplicação. Ele utiliza React Router para definir as rotas para as
páginas da aplicação.

     <BrowserRouter> é usado para habilitar o roteamento baseado em URL. Envolver o App com BrowserRouter permite que os
componentes dentro do App usem funcionalidades de roteamento, como navegação entre páginas.

        <React.StrictMode> é uma ferramenta de desenvolvimento que ajuda a identificar problemas potenciais na aplicação.
Ele não afeta o comportamento da aplicação em produção, mas pode ajudar a detectar problemas durante o desenvolvimento.
*/