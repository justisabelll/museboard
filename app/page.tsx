import SignIn from './components/sign-in';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="relative py-24 mb-16">
        <h1 className="text-7xl font-light tracking-iwidest text-center uppercase">
          Muse<span className="font-normal">board</span>
        </h1>
        <div className="flex absolute top-8 right-8 gap-6 items-center">
          {/* <ModeToggle /> */}
          <SignIn />
        </div>
      </header>

      <div className="container flex-grow px-8 mx-auto">
        <div className="flex justify-center mb-16 space-x-12">
          {['all', 'image', 'quote', 'video'].map((value) => (
            <button
              key={value}
              className={`p-3 transition-all duration-300 text-sm uppercase tracking-wider ${
                value === 'all'
                  ? 'text-black border-b border-black'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {/* Icon components would go here */}
              <span>
                {value === 'all'
                  ? 'All'
                  : value === 'youtube'
                  ? 'Videos'
                  : `${value}s`}
              </span>
            </button>
          ))}
        </div>

        {/* TileGrid component would go here */}
      </div>
      <div className="fixed right-12 bottom-12">
        {/* NewInspiration component would go here */}
      </div>
      {/* Toaster component would go here */}
    </div>
  );
}
