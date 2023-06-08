import RecommendedProductItem from '../RecommendedProductItem/RecommendedProductItem'
import classes from './RecommendedProducts.module.css'
import cream1 from '../../assets/recommendations/cream-1.png'
import cream2 from '../../assets/recommendations/cream-2.png'
import cream3 from '../../assets/recommendations/cream-3.png'

function RecommendedProducts({}) {
    return (
        <div>
            <h2 className={classes.title}>Рекомендуемые продукты</h2>
            <RecommendedProductItem src={cream1} text={'Dr. Cauracle Pro Balance Moisturizer'}></RecommendedProductItem>
            <RecommendedProductItem src={cream2} text={'Dr. Cauracle Pro Balance Oil'}></RecommendedProductItem>
            <RecommendedProductItem src={cream3} text={'Dr. Cauracle Spf 50+'}></RecommendedProductItem>

            <p className={classes.text}>
                <span>ВАЖНО: </span>
                эти рекомендации не заменяет вам консультацию с специалистом
            </p>
        </div>
    );
}

export default RecommendedProducts;
