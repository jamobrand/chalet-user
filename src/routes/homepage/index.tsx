import { Helmet } from 'react-helmet-async';
import Header from './navbar';
import Footer from './footer';
import HeroSection from './hero';
import ChaletDisplay from './home-chalets';

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>Great Rift Valley Lodge</title>
        <meta
          name="description"
          content="Voyager is a modern and elegant chalet rental platform."
        />
      </Helmet>
      <Header />
      <HeroSection />
      <ChaletDisplay />
      <Footer />
    </div>
  );
};

export default HomePage;
