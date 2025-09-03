import { Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'
import linus from '../images/linus.png'
import PostCard from './PostCard'
import Project from './Project'
import posts from '../posts.json'

const Main = () => {

  let ps1 = 'eduardo@thinkpad:~$ '
  let cursorHtml = '<span id="cursor">|</span>'
  let postBtn = "Learn more"
  let projectBtn = "Show me the code"

  let typewriterLines = ['export SOFTWARE_ENGINEER_PROFILE=$( cat << EOF',
    '> {',
    '>   "software_engineer_profile": {',
    '>     "name": "eduardo vasconcelos",',
    '>     "specialty": "security engineering",',
    '>     "coffee": "yes, please",',
    '>     "skills": {',
    '>       "advanced": [',
    '>         "research & development",',
    '>         "threat modeling",',
    '>         "security engineering",', 
    '>         "penetration testing",',
    '>         "vulnerability assessment",',
    '>         "security code review"',
    '>       ],',
    '>       "intermediate": [',
    '>         "full stack development",',
    '>         "security awareness",', 
    '>         "reverse engineering",',
    '>         "cryptography"',
    '>       ],',
    '>       "familiar": [',
    '>         "sysadmin",',
    '>         "devsecops",',
    '>         "incident response"',
    '>       ]',
    '>     }',
    '>   }',
    '> }',
    '> EOF',
    '> )',
    ps1
  ]

  let cursorBlink = (cursor, blinkSpeed) => {
    if (cursor.style.opacity === 1) {
        cursor.style.opacity = 0
    } else {
        cursor.style.opacity = 1
    }
    setTimeout(() => cursorBlink(cursor, blinkSpeed), blinkSpeed)
  }

  let typewriter = (i, j, lines, typewriterSpeed) => {
    let terminal = document.getElementById('typewriter-div')
    let html = document.getElementById('typewriter').innerHTML
    html = html.replaceAll(cursorHtml, '')
    let line = lines[i]
    if (j < line.length) {
      terminal.scrollTop = terminal.scrollHeight
      let c = line.charAt(j)
      if (c === ' ') {
        c = '&nbsp;'
      }
      html += c + cursorHtml
      document.getElementById('typewriter').innerHTML = html
      j++
      setTimeout(() => typewriter(i, j, lines, typewriterSpeed), typewriterSpeed)
    } else if (i < (lines.length - 1) && j ===  line.length) {
      terminal.scrollTop = terminal.scrollHeight
      html += '<br />' + cursorHtml
      document.getElementById('typewriter').innerHTML = html
      j = 0
      i++
      setTimeout(() => typewriter(i, j, lines, typewriterSpeed), typewriterSpeed)
    } else {
      terminal.scroll({ top: 0, behavior:'smooth' })
      let cursor = document.getElementById('cursor')
      setTimeout(() => cursorBlink(cursor, 500))
    }
  }

  useEffect(() => {
    document.getElementById('typewriter').innerHTML = ps1
    let lines = typewriterLines
    let i = 0
    let j = 0
    setTimeout(() => typewriter(i, j, lines, 10), 500)
  }, [])

  return (
    <div class="mt-5">




      {/* Hero */}

      <Row>
        <h1>Hello,</h1>
        <h2>I'm Eduardo Vasconcelos.</h2>
      </Row>

      <Row>

        <Col sm={12} xl={6}>

          <p class="mt-5 fs-5">I'm an Security Engineer with a solid background in designing, developing, and testing software security across a range of industries and technologies.</p>
          <p class="fs-5">Throughout my career, I've helped develop notable applications such as <a href="https://hackerrangers.com/" target="_blank" rel="noreferrer">Hacker Rangers</a>, <a href="https://play.google.com/store/apps/details?id=br.com.brainweb.ifood" target="_blank" rel="noreferrer">iFood</a>, and <a href="https://play.google.com/store/apps/details?id=com.samsung.android.spay" target="_blank" rel="noreferrer">Samsung Wallet</a>. My job is to craft software that's secure, stunning, and built to last. You can view my resume <a href="https://github.com/vasconcedu/my-resume/blob/master/resume.pdf" target="_blank" rel="noreferrer">here</a>.</p>
          <p class="fs-5">When I'm not in the code mines, you can find me jamming to old school country tunes, sharpening my trusty pocket knives, refilling my cherished fountain pens, and channeling my inner tradesman with some home renovation projects and car repairs.</p>
        
        </Col>

        <Col sm={12} xl={6}>

          <div class="mt-5 my-terminal ms-lg-3">

            <div class="my-terminal-title-bar d-flex justify-content-between align-items-center pb-2 mb-0 text-center shadow">
              <p class="flex-grow-1 text-center">eduardo@thinkpad:&tilde;</p>
              <div class="d-flex align-items-center float-right">

                <span class="my-terminal-title-bar-button">
                  <p>&#9866;</p>
                </span>

                <span class="ms-2 my-terminal-title-bar-button">
                  <p>&#9744;</p>
                </span>

                <span class="ms-2 my-terminal-title-bar-button">
                  <p>&#9746;</p>
                </span>

              </div>
            </div>

            <div class="my-terminal-typewriter text-break mt-0 p-0 shadow" id="typewriter-div">
              <p id="typewriter">
                {ps1}
              </p>
            </div>

          </div>
        </Col>

      </Row>




      <hr class="m-5" />




      {/* Blog */}

      <Row>
        <h3>Blog Posts</h3>
      </Row>

      <Row className="mb-5">
        {posts.posts.map((post, index) => (
          <PostCard
            cap={`/images/${post.cap}`}
            alt={post.alt}
            title={post.title}
            headline={post.headline}
            updated={post.updated}
            btn={postBtn}
            href={`/#/blog/${post.slug}`}
          />
        ))}
      </Row>




      <hr class="m-5" />




      {/* Projects */}

      <Row>
        <h3>Projects</h3>
      </Row>

      <Row className="mb-5">

        <Project title="This Website" text="Crafted in VS Code by yours truly, using React and Bootstrap." btn={projectBtn} href="https://github.com/vasconcedu/vasconcedu.github.io" cursor={linus} />

      </Row>

    </div>
  )
}

export default Main
