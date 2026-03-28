import axios from "axios";

function SupprimerVoiture({ id, onDeleted, className }) {

  const handleSupp = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) {
      axios.post("http://localhost/Asya-App/back-end/deleteVoiture.php", { id })
        .then(res => {
          alert(res.data.message);
          onDeleted();
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <button 
      onClick={handleSupp} 
      className={`${className}`}  // مهم بزاف
    >
      Supprimer
    </button>
  )
}
export default SupprimerVoiture;