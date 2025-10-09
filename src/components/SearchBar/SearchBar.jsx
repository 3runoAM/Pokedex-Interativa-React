import style from './SearchBar.module.css';
import {useState} from "react";

export default function SearchBar({onSearch, PokemonNameList, searchTerm, setSearchTerm, showList, setShowList}) {
    // const [searchTerm, setSearchTerm] = useState("");
    // const [showList, setShowList] = useState(false);

    const filteredList = PokemonNameList
        .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setShowList(value.length > 0);
    };

    const handleSelect = (name) => {
        setSearchTerm(name);
        onSearch(name);
        setShowList(false);
    };

    const handleSearch = () => {
        setShowList(false);
        onSearch(searchTerm);
    };

    return (
        <div className={`${style.searchBarContainer} flex-row flex-center smallPadding`}>
            <input value={searchTerm}
                   onChange={handleInputChange}
                   name="Pokemon name or ID"
                   list="nameList"
                   className={`mediumPadding`}
                   type="text"
                   placeholder="Pokemon name or ID"/>

            {showList && filteredList.length > 0 && (
                <ul className={style.dropdown}>
                    {filteredList.map((name) => (
                        <li key={name} onClick={() => handleSelect(name)}>
                            {name}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={handleSearch} className={`flex-row flex-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3">
                    <path
                        d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/>
                </svg>
            </button>
        </div>
    );
}