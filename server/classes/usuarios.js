class Usuarios
{

    constructor() {
        this.personas = [];
    }

    agregarPersona = (id, nombre, sala) => {

        const persona = { id, nombre, sala };
        this.personas.push(persona);

        return this.personas;

    }

    getPersona = (id) => this.personas.filter((persona) => id === persona.id)[0];

    getPersonas = () => this.personas;

    getPersonasPorSala = (sala) => this.personas.filter((persona) => persona.sala === sala);

    borrarPersona = (id) => {

        const deleted = this.getPersona(id);
        this.personas = this.personas.filter((persona) => persona.id !== id);

        return deleted;
    }

}

module.exports = { Usuarios };