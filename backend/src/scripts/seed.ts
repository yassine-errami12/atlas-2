import User from '../models/User';
import Product from '../models/Product';
import Review from '../models/Review';
import Order from '../models/Order';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    // Seed users
    const users = await User.insertMany([
      {
        name: 'Admin Atlas',
        email: 'admin@atlas.ma',
        password: await hashPassword('admin123'),
        role: 'admin',
      },
      {
        name: 'Youssef B.',
        email: 'user@atlas.ma',
        password: await hashPassword('user1234'),
        role: 'user',
      },
    ]);

    logger.info('Users seeded:', users.length);

    // Seed products
    const products = await Product.insertMany([
      {
        title: 'Écouteurs sans fil Atlas Pro',
        description:
          'Son immersif avec réduction de bruit active. Autonomie 24h avec le boîtier de charge.',
        price: 599,
        category: 'Audio',
        brand: 'Atlas',
        stock: 42,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        rating: 4.6,
        reviewsCount: 128,
      },
      {
        title: 'Montre connectée Sahara S2',
        description: 'Suivi santé, GPS intégré, écran AMOLED. Compatible iOS et Android.',
        price: 1299,
        category: 'Wearables',
        brand: 'Sahara',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        rating: 4.4,
        reviewsCount: 86,
      },
      {
        title: 'Batterie externe MedinaTech 20000mAh',
        description: 'Charge rapide 22.5W, 3 ports USB. Idéale pour voyager au Maroc.',
        price: 349,
        category: 'Charge',
        brand: 'MedinaTech',
        stock: 75,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
        rating: 4.7,
        reviewsCount: 211,
      },
      {
        title: 'Casque Argan Studio One',
        description: 'Audio Hi-Res, coussinets en cuir véritable, autonomie 40h.',
        price: 899,
        category: 'Audio',
        brand: 'Argan',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
        rating: 4.8,
        reviewsCount: 64,
      },
      {
        title: 'Câble USB-C tressé Casablanca 2m',
        description: 'Charge rapide 100W, gaine en nylon tressé ultra-résistante.',
        price: 89,
        category: 'Charge',
        brand: 'Casablanca',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
        rating: 4.3,
        reviewsCount: 340,
      },
      {
        title: 'Enceinte Bluetooth Atlas Boom',
        description: "Son 360°, étanche IPX7, 16h d'autonomie. Parfaite pour la plage d'Agadir.",
        price: 449,
        category: 'Audio',
        brand: 'Atlas',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1589003077984-894e133814c9?w=500&h=500&fit=crop',
        rating: 4.5,
        reviewsCount: 92,
      },
      {
        title: 'Fitness Tracker Sahara Z1',
        description: "Moniteur cardiaque, 7 sports, 14 jours d'autonomie.",
        price: 449,
        category: 'Wearables',
        brand: 'Sahara',
        stock: 28,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
        rating: 4.6,
        reviewsCount: 156,
      },
      {
        title: 'Souris sans fil MedinaTech Pro',
        description: 'Ergonomique, 2.4GHz, batterie 18 mois. Parfaite pour le travail.',
        price: 199,
        category: 'Gaming',
        brand: 'MedinaTech',
        stock: 67,
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
        rating: 4.4,
        reviewsCount: 203,
      },
    ]);

    logger.info('Products seeded:', products.length);

    // Seed reviews
    const reviews = await Review.insertMany([
      {
        productId: products[0]._id,
        userId: users[1]._id,
        author: 'Youssef B.',
        rating: 5,
        comment:
          'Excellent produit ! La qualité du son est incroyable et la réduction de bruit fonctionne parfaitement.',
      },
      {
        productId: products[0]._id,
        userId: users[1]._id,
        author: 'Youssef B.',
        rating: 4,
        comment: 'Très bon pour le prix. La batterie dure vraiment longtemps.',
      },
      {
        productId: products[2]._id,
        userId: users[1]._id,
        author: 'Youssef B.',
        rating: 5,
        comment: 'Charge mon téléphone en un rien de temps. Indispensable !',
      },
    ]);

    logger.info('Reviews seeded:', reviews.length);
    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

export default seedDatabase;
