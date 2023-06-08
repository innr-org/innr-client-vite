import RecommendedSpecialistPerson from '../RecommendedSpecialistPerson/RecommendedSpecialistPerson'
import classes from './RecommendedSpecialists.module.css'
import person from '../../assets/recommendations/person.png'

function RecommendedSpecialists({specialists}) {
    let RecommendedSpecialistItems
    if(specialists){
        RecommendedSpecialistItems = specialists.map(specialist => {
            return  <RecommendedSpecialistPerson
                src={person}
                name={specialist.name}
                city={'Астана'}
                specialty={'Врач дерматолог'}
                experience={'7+ лет'}
                tags={specialist.tags}
                rating={specialist.rating}
                visits={specialist.visited}
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
