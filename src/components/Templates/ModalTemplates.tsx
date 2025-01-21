import { Frame, Modal, TextContainer } from '@shopify/polaris';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';
import Template5 from './Template5';
import { Lead } from '../../services/leads';

interface ModalTemplateProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    templateNumber: number;
    clientNumber: string;
    clientInfo: Lead;
}

type TemplateComponent = (props: { setIsOpen: (isOpen: boolean) => void; clientNumber: string; clientInfo: Lead }) => JSX.Element;

const templates: { [key: number]: TemplateComponent } = {
    1: Template1,
    2: Template2,
    3: Template3,
    4: Template4,
    5: Template5
};

export default function ModalTemplates({ isOpen, setIsOpen, templateNumber, clientNumber, clientInfo }: ModalTemplateProps) {
    const Template = templates[templateNumber];

    return (
        <div style={{ height: '500px' }}>
            <Frame>
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={`Template ${templateNumber}`}
                >
                    <Modal.Section>
                        <TextContainer>
                            <Template setIsOpen={setIsOpen} clientNumber={clientNumber} clientInfo={clientInfo} />
                        </TextContainer>
                    </Modal.Section>
                </Modal>
            </Frame>
        </div>
    );
}
