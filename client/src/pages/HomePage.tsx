const HomePage = () => {

  return (
    <>
      <section className='main'>
        <div className='typewriter'>
          <h1 className='title'>Welcome to Ubiquiti Checklist App</h1>
        </div>
        <div className='main__text-wrapper'>
          <p className='main__app-description'> Welcome to my Checklist App which is deployed using Cloudflare for the frontend and Heroku for the server. The client side is built with React and typescript and the server side is built with Express, typescript, SQL and ws.
            </p>
          <p className='main__app-signature'>Marta Lewandowska</p>
        </div>
      </section> 
    </>

  );
};

export default HomePage;