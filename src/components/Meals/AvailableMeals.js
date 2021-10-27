import { useEffect, useState } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initial state is 'true' because we fetch the meals data as soon as the component renders; would usually be set to false

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/meals.json');
      const responseData = await response.json();

      const loadedMeals = []

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    }

    fetchMeals();
  }, []);

  // Having this 'if' statement here, if 'isLoading' is true, we return this jsx, and the code below this 'if' statement is never executed
  if (isLoading) {
    return (
      <section className={classes['meals-loading']}>
        <p>Loading...</p>
      </section>
    )
  };

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
