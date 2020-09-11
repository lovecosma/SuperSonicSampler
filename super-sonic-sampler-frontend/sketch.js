SAMPLES_URL = 'http://localhost:3000/samples'

document.addEventListener('DOMContentLoaded', onLoad)
const samples = []
const sample_selection = () => document.getElementById("sample-selection")

function getSamples(){
  for (var i = 0; i < sample_selection().length; i++) {
    sample_selection().remove(i)
  }
  fetch(SAMPLES_URL)
  .then(resp => resp.json())
  .then(json => renderSamples(json))
}

function renderSamples(samples){
  samples.forEach((sample, i) => {
    let option = document.createElement('option')
    option.innerText = `${sample.id} ${sample.name}`
    sample_selection().appendChild(option)
  });
}




function onLoad(){

  const sampler_area = () => document.getElementById('sampler')
  const form = () => document.getElementById('add-sample')
  const file = () => document.getElementById('file')
  const audio_sample = () => file().files[0]
  const file_input = () => document.getElementById('file')
  const sample_name = () => document.getElementById('sample-name')
  const existing_sample_form = () => document.getElementById("select-sample")
  let numberOfSamples = 0
  getSamples()

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
  let formData = new FormData()
   formData.append('name', name)
   formData.append('file', file)

     fetch(SAMPLES_URL, {
        method: 'POST',
        body: formData
     })
     .then(resp => resp.json())
     .then(data => {
        if (data.errors) {
           alert(data.errors)
        }
        else {
           console.log(data.url)
        }
      })

}
