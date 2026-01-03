import { Container, Menu } from "lucide-react";
import { Logo } from "../../components/Logo";
import { Footer } from "../../components/Footer";

type MainTemplateProps = {
    children: React.ReactNode
}

export function MainTemplate({ children }:MainTemplateProps) {
    return (
        <>
          <Container><Logo /></Container>
          <Container><Menu /></Container>
          {children}
          <Container><Footer /></Container>
        </>
      );
}