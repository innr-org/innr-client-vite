import RecommendedSpecialistPerson from '../RecommendedSpecialistPerson/RecommendedSpecialistPerson'
import classes from './RecommendedSpecialists.module.css'
import person from '../../assets/recommendations/person.png'

function RecommendedSpecialists({specialists}) {
    let RecommendedSpecialistItems
    if(specialists){
        RecommendedSpecialistItems = specialists.map(specialist => {
            return  <RecommendedSpecialistPerson
                src={specialist.image}
                name={specialist.fullName}
                city={specialist.city}
                specialty={specialist.speciality}
                experience={`${specialist.experience} лет`}
                tags={specialist.tags}
                rating={specialist.rating}
                visits={"100"}
                specialist={specialist}
            >
            </RecommendedSpecialistPerson>
        })
        console.log(specialists)
    }

    return (
        <div>
            <h2 className={classes.title}>Рекомендуемые специалисты</h2>
            {RecommendedSpecialistItems}
        </div>
    );
}

export default RecommendedSpecialists;
