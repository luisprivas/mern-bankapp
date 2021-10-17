function Card(props) {
  function headerStyle() {
    const bg = props.headerbgcolor ? ' bg-' + props.headerbgcolor : ' ';
    const txt = props.headertxtcolor ? ' text-' + props.headertxtcolor : ' text-black';
    return 'card-header' + bg + txt;
  }

  return (
    <div className="mx-auto">
      <div className="card mb-3" style={{ maxWidth: '18rem' }}>
        <div className={headerStyle()}>{props.header}</div>
        <div className="card-body bg-light">
          {props.title && <h5 className="card-title">{props.title}</h5>}
          {props.text && <p className="card-text">{props.text}</p>}
          {props.text1 && <p className="card-text">{props.text1}</p>}
          {props.text2 && <p className="card-text">{props.text2}</p>}
          {props.text3 && <p className="card-text">{props.text3}</p>}
          {props.body}
          {props.status && <div id="createStatus">{props.status}</div>}
        </div>
      </div>
    </div>
  );
}

function BankFormInput(props) {
  return (
    <p>
      {props.title}: <br />
      <input
        type="input"
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </p>
  );
}

function BankFormButton(props) {
  function buttonStyle() {
    const bg = props.bgcolor ? ' btn-' + props.bgcolor : '';
    return 'btn' + bg;
  }
  return (
    <button id={props.id} type="submit" className={buttonStyle()} onClick={props.onClick}>
      {props.text}
    </button>
  );
}

export { Card, BankFormInput, BankFormButton };
