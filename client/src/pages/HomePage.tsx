const HomePage = () => {

  return (
    <>
      <section className='main'>
        <div className='typewriter'>
          <h1 className='title'>Welcome to Ubiquiti Checklist App</h1>
        </div>
        <div className="colors-border" >
          <div className='main__text-wrapper'>
            <p className='main__app-description'> Welcome to Checklist App which is deployed using Cloudflare for the frontend and Heroku for the backend. The client side is built with React and Typescript and the server is built with Express, Typescript, SQL and WS.
              </p>
            <p className='main__app-signature'>Marta Lewandowska</p>
          </div>
        </div>
      </section> 
    </>

  );
};

export default HomePage;