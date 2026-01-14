import "./App.css";
import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";

const PokemonRow = ({ pokemon, onSelect }) => (
  <tr>
    <td>{pokemon.name.english}</td>
    <td>{pokemon.type.join(",")}</td>
    <td>
      <Button
        variant="contained"
        color="success"
        onClick={() => onSelect(pokemon)}
      >
        View Stats
      </Button>
    </td>
  </tr>
);

PokemonRow.propTypes = {
  pokemon: PropTypes.shape({
    name: PropTypes.shape({
      english: PropTypes.string.isRequired,
    }),
    type: PropTypes.arrayOf(PropTypes.string),
  }),
  onSelect: PropTypes.func.isRequired,
};

const PokemonInfo = ({ name, base }) => (
  <div>
    <h1>{name.english}</h1>
    <table>
      {Object.keys(base).map((key) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{base[key]}</td>
        </tr>
      ))}
    </table>
  </div>
);

PokemonInfo.propTypes = {
  name: PropTypes.shape({
    english: PropTypes.string.isRequired,
  }),
  base: PropTypes.shape({
    HP: PropTypes.number.isRequired,
    Attack: PropTypes.number.isRequired,
    Defense: PropTypes.number.isRequired,
    "Sp. Attack": PropTypes.number.isRequired,
    "Sp. Defense": PropTypes.number.isRequired,
    Speed: PropTypes.number.isRequired,
  }),
};

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
`;
const Container = styled.div`
  margin: 40px auto;
  width: 900px;
  padding-top: 1rem;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
`;
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const Input = styled.input`
  width: 80%;
  font-size: large;
  padding: 0.4rem;
  margin-bottom: 20px;
`;
const ListWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      pokemon: [],
      selectedItem: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/react-pokemon-search/pokemon.json")
      .then((resp) => resp.json())
      .then((pokemon) =>
        this.setState({
          ...this.state,
          pokemon,
        })
      );
  }

  render() {
    return (
      <Container>
        <Title>Pokemon Search</Title>
        <TwoColumnLayout>
          <LeftColumn>
            <Input
              value={this.state.filter}
              onChange={(evt) =>
                this.setState({ ...this.state, filter: evt.target.value })
              }
            />
            <ListWrapper>
              <table width="100%">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pokemon
                    .filter((pokemon) =>
                      pokemon.name.english
                        .toLocaleLowerCase()
                        .includes(this.state.filter.toLocaleLowerCase())
                    )
                    .slice(0, 20)
                    .map((pokemon) => (
                      <PokemonRow
                        pokemon={pokemon}
                        key={pokemon.id}
                        onSelect={(pokemon) =>
                          this.setState({
                            ...this.state,
                            selectedItem: pokemon,
                          })
                        }
                      />
                    ))}
                </tbody>
              </table>
            </ListWrapper>
          </LeftColumn>
          {this.state.selectedItem && (
            <PokemonInfo {...this.state.selectedItem} />
          )}
        </TwoColumnLayout>
      </Container>
    );
  }
}

export default App;
