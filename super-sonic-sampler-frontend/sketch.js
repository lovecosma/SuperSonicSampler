SAMPLES_URL = 'http://localhost:3000/samples'

document.addEventListener('DOMContentLoaded', onLoad)
const samples = []


function onLoad(){

  const sampler_area = () => document.getElementById('sampler')
  const form = () => document.getElementById('add-sample')
  const file = () => document.getElementById('file')
  const audio_sample = () => file().files[0]
  const file_input = () => document.getElementById('file')
  const sample_name = () => document.getElementById('sample-name')
  let numberOfSamples = 0

  form().addEventListener('submit', addSample)

  function addSample(e){
    e.preventDefault()
    const audio_file = audio_sample()
    const audio_path = URL.createObjectURL(audio_file)
    const sampler = sampler_area()
    const new_pad = document.createElement('button')
    if(audio_file.type == 'audio/wav' || audio_file.type == 'audio/mp3'){ numberOfSamples ++}
    new_pad.id = `Pad ${numberOfSamples}`
    new_pad.className = 'box'
    new_pad.innerText = sample_name().value
    sampler.appendChild(new_pad)
    const sample = new Tone.Player(audio_path, addEvent.bind(new_pad))

    submitData(new_pad.innerText, audio_file)
    samples.push(sample)
    form().reset()
  }

  function addEvent(e){
    const player = e
    const pad = document.getElementById(this.id)
    pad.addEventListener('click', playSample.bind(player))
  }

  function playSample(e){
    this.toMaster().start()
  }

}

function submitData(name, file){
  let formData = {
    name: name,
    audio: file
  };
  debugger
  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  return fetch(SAMPLES_URL, configObj)
    .then(function(response) {
      return response.json();
    })
    .then(function(object) {
      console.log(object);
    })
    .catch(function(object){

    });

}
