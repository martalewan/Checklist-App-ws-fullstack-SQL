
import { render } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Footer from './components/Footer/Footer';

test('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Router>
      <App />
    </Router>, div
  );
  ReactDOM.unmountComponentAtNode(div);
});

test('Snapshot', () => {
  const { asFragment } = render(<Footer />)
  expect(asFragment()).toMatchSnapshot();
});