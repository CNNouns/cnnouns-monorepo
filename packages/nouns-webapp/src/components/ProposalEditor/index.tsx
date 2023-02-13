import classes from './ProposalEditor.module.css';
import { InputGroup, FormControl, FormText } from 'react-bootstrap';
import remarkBreaks from 'remark-breaks';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { Trans } from '@lingui/macro';

const ProposalEditor = ({
  title,
  body,
  onTitleInput,
  onBodyInput,
}: {
  title: string;
  body: string;
  onTitleInput: (title: string) => void;
  onBodyInput: (body: string) => void;
}) => {
  const bodyPlaceholder = `## 概要\n\n（ここに提案の要約を記述してください）\n\n## 実現方法\n\n（ここに実現方法を記述してください）\n\n## 結論\n\n（ここに結論を記述してください）`;
  const [proposalText, setProposalText] = useState('');

  const onBodyChange = (body: string) => {
    setProposalText(body);
    onBodyInput(body);
  };

  return (
    <div>
      <InputGroup className={`${classes.proposalEditor} d-flex flex-column`}>
        <FormText>
          <Trans>Proposal</Trans>
        </FormText>
        <FormControl
          className={classes.titleInput}
          value={title}
          onChange={e => onTitleInput(e.target.value)}
          placeholder="提案タイトル"
        />
        <hr className={classes.divider} />
        <FormControl
          className={classes.bodyInput}
          value={body}
          onChange={e => onBodyChange(e.target.value)}
          as="textarea"
          placeholder={bodyPlaceholder}
        />
      </InputGroup>
      {proposalText !== '' && (
        <div className={classes.previewArea}>
          <h3>
            <Trans>Preview</Trans>
          </h3>
          {title && (
            <>
              <h1 className={classes.propTitle}>{title}</h1>
              <hr />
            </>
          )}
          <ReactMarkdown
            className={classes.markdown}
            children={proposalText}
            remarkPlugins={[remarkBreaks]}
          />
        </div>
      )}
    </div>
  );
};
export default ProposalEditor;
