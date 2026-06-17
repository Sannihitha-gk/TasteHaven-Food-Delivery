import Navbar from "../components/Navbar";
import RestaurantList from "../components/RestaurantList";
import MenuList from "../components/MenuList";
import heroBanner from "../assets/hero-banner.jpg";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>Order Your Favourite Food</h1>
          <p>
            Fresh Biryani and Pizza delivered to your doorstep
          </p>
        </div>
      </section>

      <section>
        <h2 className="section-title">
          Popular Restaurants
        </h2>

        <RestaurantList />
      </section>

      <section>
        <h2 className="section-title">
          Top Dishes Near You
        </h2>

        <MenuList />
      </section>
    </>
  );
}

export default Home;