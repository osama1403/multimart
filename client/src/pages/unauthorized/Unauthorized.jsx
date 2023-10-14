const Unauthorized = () => {
 
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center font-nunito">
      <h1 className="text-3xl text-primary ">Unauthorized!</h1>
      {/* {
        location.state &&
        <button className=" box-border inline-block mt-4 border border-primary p-3 text-xl text-zinc-600 hover:text-primary" onClick={() => { history.back() }}>
          Go Back
        </button>
      } */}
    </div>
  );
}

export default Unauthorized;